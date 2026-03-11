from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import time


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://minecraft-cube-stats.netlify.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class ServerScanRequest(BaseModel):
    ip: str
    port: int = 25565

class ServerHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ip: str
    port: int
    hostname: Optional[str] = None
    online: bool = True
    latency: Optional[float] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FavoriteServer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ip: str
    port: int
    hostname: Optional[str] = None
    added_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# API Routes
@api_router.get("/")
async def root():
    return {"message": "CubeStats API"}

@api_router.post("/server/scan")
async def scan_server(request: ServerScanRequest):
    """Fetch server information from mcsrvstat.us API with latency measurement"""
    try:
        start_time = time.time()
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"https://api.mcsrvstat.us/2/{request.ip}:{request.port}"
            response = await client.get(url)
            latency = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code != 200:
                raise HTTPException(status_code=502, detail="Failed to fetch server data")
            
            data = response.json()
            
            # Check if server is online
            if not data.get('online', False):
                # Save failed scan to history
                history_entry = ServerHistory(
                    ip=request.ip,
                    port=request.port,
                    hostname=data.get('hostname', request.ip),
                    online=False,
                    latency=latency
                )
                history_doc = history_entry.model_dump()
                history_doc['timestamp'] = history_doc['timestamp'].isoformat()
                await db.server_history.insert_one(history_doc)
                
                return {
                    "success": False,
                    "online": False,
                    "message": "Server is offline or does not exist",
                    "ip": request.ip,
                    "port": request.port,
                    "latency": round(latency, 2)
                }
            
            # Save to history
            history_entry = ServerHistory(
                ip=request.ip,
                port=request.port,
                hostname=data.get('hostname', request.ip),
                online=True,
                latency=latency
            )
            history_doc = history_entry.model_dump()
            history_doc['timestamp'] = history_doc['timestamp'].isoformat()
            await db.server_history.insert_one(history_doc)
            
            return {
                "success": True,
                "online": True,
                "data": data,
                "latency": round(latency, 2)
            }
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timeout. Server might be slow or unreachable.")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Network error: {str(e)}")
    except Exception as e:
        logging.error(f"Error scanning server: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.get("/server/history", response_model=List[Dict[str, Any]])
async def get_server_history():
    """Get recently scanned servers"""
    try:
        history = await db.server_history.find(
            {}, 
            {"_id": 0}
        ).sort("timestamp", -1).limit(50).to_list(50)
        
        # Convert ISO strings back to datetime for proper serialization
        for item in history:
            if isinstance(item['timestamp'], str):
                item['timestamp'] = datetime.fromisoformat(item['timestamp'])
        
        return history
    except Exception as e:
        logging.error(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")

@api_router.get("/player/{username}")
async def get_player_stats(username: str):
    """Fetch player statistics from multiple sources"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Try Mojang API first
            try:
                uuid_response = await client.get(
                    f"https://api.mojang.com/users/profiles/minecraft/{username}"
                )
                
                if uuid_response.status_code == 200:
                    uuid_data = uuid_response.json()
                    uuid = uuid_data['id']
                    formatted_uuid = f"{uuid[:8]}-{uuid[8:12]}-{uuid[12:16]}-{uuid[16:20]}-{uuid[20:]}"
                    
                    # Try to get additional data from PlayerDB
                    playerdb_data = {}
                    try:
                        playerdb_response = await client.get(
                            f"https://playerdb.co/api/player/minecraft/{username}"
                        )
                        if playerdb_response.status_code == 200:
                            playerdb_data = playerdb_response.json().get('data', {}).get('player', {})
                    except:
                        pass
                    
                    # Try SessionServer for profile
                    try:
                        profile_response = await client.get(
                            f"https://sessionserver.mojang.com/session/minecraft/profile/{uuid}"
                        )
                        profile_data = profile_response.json() if profile_response.status_code == 200 else {}
                    except:
                        profile_data = {}
                    
                    return {
                        "success": True,
                        "source": "mojang",
                        "name": uuid_data['name'],
                        "uuid": formatted_uuid,
                        "uuid_raw": uuid,
                        "skin": f"https://crafatar.com/renders/body/{uuid}?overlay",
                        "head": f"https://crafatar.com/avatars/{uuid}?overlay",
                        "legacy": profile_data.get('legacy', False),
                        "username_history": playerdb_data.get('meta', {}).get('name_history', [])
                    }
            except httpx.HTTPStatusError as e:
                if e.response.status_code != 404:
                    raise
            
            # Fallback to PlayerDB API
            try:
                playerdb_response = await client.get(
                    f"https://playerdb.co/api/player/minecraft/{username}"
                )
                
                if playerdb_response.status_code == 200:
                    data = playerdb_response.json()
                    if data.get('success') and data.get('data', {}).get('player'):
                        player = data['data']['player']
                        uuid = player.get('id', player.get('raw_id', ''))
                        
                        # Format UUID if needed
                        if len(uuid) == 32:
                            formatted_uuid = f"{uuid[:8]}-{uuid[8:12]}-{uuid[12:16]}-{uuid[16:20]}-{uuid[20:]}"
                        else:
                            formatted_uuid = uuid
                        
                        return {
                            "success": True,
                            "source": "playerdb",
                            "name": player.get('username', username),
                            "uuid": formatted_uuid,
                            "uuid_raw": uuid.replace('-', ''),
                            "skin": f"https://crafatar.com/renders/body/{uuid.replace('-', '')}?overlay",
                            "head": f"https://crafatar.com/avatars/{uuid.replace('-', '')}?overlay",
                            "legacy": False,
                            "username_history": player.get('meta', {}).get('name_history', [])
                        }
            except:
                pass
            
            raise HTTPException(status_code=404, detail="Player not found in any database")
            
    except HTTPException:
        raise
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timeout while fetching player data")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Network error: {str(e)}")
    except Exception as e:
        logging.error(f"Error fetching player stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch player statistics")

@api_router.get("/player/{username}/hypixel")
async def get_hypixel_stats(username: str, api_key: Optional[str] = None):
    """Fetch Hypixel player statistics"""
    try:
        # First get UUID from Mojang
        async with httpx.AsyncClient(timeout=10.0) as client:
            uuid_response = await client.get(
                f"https://api.mojang.com/users/profiles/minecraft/{username}"
            )
            
            if uuid_response.status_code != 200:
                raise HTTPException(status_code=404, detail="Player not found")
            
            uuid = uuid_response.json()['id']
            
            # Note: Hypixel API requires an API key
            # For demo purposes, return player lookup info
            return {
                "success": True,
                "message": "Hypixel stats require an API key. Get yours at https://api.hypixel.net",
                "uuid": uuid,
                "player": username,
                "links": {
                    "hypixel_profile": f"https://plancke.io/hypixel/player/stats/{username}",
                    "hypixel_skyblock": f"https://sky.shiiyu.moe/stats/{username}",
                    "hypixel_guild": f"https://plancke.io/hypixel/guild/player/{username}"
                }
            }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching Hypixel stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch Hypixel statistics")

@api_router.get("/server/uptime/{ip}/{port}")
async def get_server_uptime(ip: str, port: int):
    """Calculate server uptime based on scan history"""
    try:
        # Get scans from the last 30 days
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        
        history = await db.server_history.find(
            {
                "ip": ip,
                "port": port
            },
            {"_id": 0}
        ).sort("timestamp", -1).to_list(1000)
        
        if not history:
            return {
                "uptime_percentage": None,
                "total_scans": 0,
                "successful_scans": 0,
                "failed_scans": 0,
                "average_latency": None,
                "last_seen": None
            }
        
        # Convert ISO strings to datetime
        for item in history:
            if isinstance(item['timestamp'], str):
                item['timestamp'] = datetime.fromisoformat(item['timestamp'])
        
        # Filter last 30 days
        recent_history = [h for h in history if h['timestamp'] >= thirty_days_ago]
        
        total_scans = len(recent_history)
        successful_scans = sum(1 for h in recent_history if h.get('online', False))
        failed_scans = total_scans - successful_scans
        
        uptime_percentage = (successful_scans / total_scans * 100) if total_scans > 0 else 0
        
        # Calculate average latency for successful scans
        latencies = [h.get('latency', 0) for h in recent_history if h.get('online', False) and h.get('latency')]
        average_latency = sum(latencies) / len(latencies) if latencies else None
        
        # Get last seen online
        last_online = next((h for h in history if h.get('online', False)), None)
        last_seen = last_online['timestamp'] if last_online else None
        
        return {
            "uptime_percentage": round(uptime_percentage, 2),
            "total_scans": total_scans,
            "successful_scans": successful_scans,
            "failed_scans": failed_scans,
            "average_latency": round(average_latency, 2) if average_latency else None,
            "last_seen": last_seen,
            "period_days": 30
        }
        
    except Exception as e:
        logging.error(f"Error calculating uptime: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to calculate uptime")

@api_router.post("/favorites/add")
async def add_favorite(request: ServerScanRequest):
    """Add a server to favorites"""
    try:
        # Check if already favorited
        existing = await db.favorites.find_one(
            {"ip": request.ip, "port": request.port},
            {"_id": 0}
        )
        
        if existing:
            return {"success": True, "message": "Server already in favorites", "id": existing['id']}
        
        favorite = FavoriteServer(
            ip=request.ip,
            port=request.port
        )
        fav_doc = favorite.model_dump()
        fav_doc['added_at'] = fav_doc['added_at'].isoformat()
        await db.favorites.insert_one(fav_doc)
        
        return {"success": True, "message": "Server added to favorites", "id": favorite.id}
    except Exception as e:
        logging.error(f"Error adding favorite: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add favorite")

@api_router.delete("/favorites/remove/{server_id}")
async def remove_favorite(server_id: str):
    """Remove a server from favorites"""
    try:
        result = await db.favorites.delete_one({"id": server_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Favorite not found")
        
        return {"success": True, "message": "Server removed from favorites"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error removing favorite: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to remove favorite")

@api_router.get("/favorites", response_model=List[Dict[str, Any]])
async def get_favorites():
    """Get all favorite servers"""
    try:
        favorites = await db.favorites.find(
            {},
            {"_id": 0}
        ).sort("added_at", -1).to_list(100)
        
        # Convert ISO strings back to datetime
        for item in favorites:
            if isinstance(item['added_at'], str):
                item['added_at'] = datetime.fromisoformat(item['added_at'])
        
        return favorites
    except Exception as e:
        logging.error(f"Error fetching favorites: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch favorites")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
