# CubeStats 🎮

<div align="center">
  <img src="https://customer-assets.emergentagent.com/job_server-scanner-3/artifacts/o9g0ldxd_cubestats_logo-removebg-preview.png" alt="CubeStats Logo" width="120"/>
  
  <h3>Professional Minecraft Server Scanner & Analytics Platform</h3>
  <p>Real-time server monitoring with advanced analytics, player tracking, and performance insights</p>

  [![Made with React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4.5.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

---

## ✨ Features Overview

### 🎯 Core Server Scanning
- **Real-time Server Status** - Instant online/offline detection with animated indicators
- **Performance Metrics** - Latency measurement with color-coded quality indicators (Excellent/Good/Fair/Poor)
- **30-Day Uptime Tracking** - Historical reliability analysis with success rate percentage
- **Server Information** - Version, protocol, software, MOTD with Minecraft color code rendering
- **Player Statistics** - Current players, max capacity, visual progress bars
- **Plugins & Mods** - Display server extensions when available

### 📊 Advanced Analytics

#### Performance Charts
- **Latency Tracking** - Real-time line graphs showing ping history over time
- **Player Trends** - Visual graphs of player population changes
- **Average Metrics** - Calculate and display average latency and player counts
- **Beautiful Visualizations** - Powered by Recharts with neon green gradients
- **Auto-saving Data** - Builds performance history automatically

#### Player Activity Log 🆕
- **Join/Leave Detection** - Automatically tracks when players join and leave
- **Playtime Calculation** - Shows how long each player was online (e.g., "played 2h 15m")
- **Currently Playing** - Live list of active players with session duration
- **Activity Timeline** - Chronological feed with color-coded events
- **Time Ago Format** - Human-readable timestamps (e.g., "1h ago", "5m ago")
- **Session Management** - Tracks up to 100 recent events per server

### 🏷️ Organization & Management

#### Server Categories
- **Custom Tags** - Add your own category labels to servers
- **Quick Tags** - One-click tags: Survival, Creative, PvP, Skyblock, Minigames, Roleplay
- **Visual Badges** - Neon green outlined badges with remove buttons
- **Per-server Storage** - Each server has its own categories

#### Server Notes
- **Rich Text Notes** - Add custom notes for each server
- **Edit Mode** - Clean edit/view interface
- **Save/Cancel** - Confirm changes before saving
- **Persistent Storage** - Notes saved to localStorage

#### Favorites System
- **Quick Access** - Save frequently monitored servers
- **Remove Option** - Easy management with delete buttons
- **Comparison View** - Compare favorite servers side-by-side
- **Export Feature** - Bulk export all favorites as JSON

### 📦 Batch Operations

#### Batch Server Scan 🆕
- **Multi-server Scanning** - Scan up to 20 servers simultaneously
- **Progress Tracking** - Real-time progress bar during batch operations
- **Smart Formatting** - Support for ip:port format with auto-default to 25565
- **Comments Support** - Lines starting with # are ignored
- **Results Summary** - Shows online/offline count after completion
- **Rate Limiting** - 500ms delay between scans to avoid API throttling

#### Bulk Export
- **Export Favorites** - Download all favorite servers as JSON
- **Export History** - Download complete scan history
- **Timestamped Files** - Organized file naming with dates
- **Metadata Included** - Export date and total count in file

### 🔄 Real-time Features

#### Auto-refresh
- **30-Second Intervals** - Automatic server rescanning
- **Toggle Control** - Enable/disable with switch
- **Background Updates** - Silent refreshes without interruption

#### Manual Refresh
- **On-demand Updates** - Instant server rescan
- **Performance Data** - Adds data point to charts
- **Activity Detection** - Checks for player changes

#### Live Timestamps
- **Auto-updating Display** - Shows "Updated X ago"
- **Natural Language** - "just now", "5 minutes ago", "2 hours ago"
- **Re-render Every 10s** - Keeps time display current

### 🔍 Data Management

#### History Tracking
- **Recent Scans** - Last 50 server scans stored
- **Online/Offline Status** - Historical status tracking
- **Latency Records** - Performance history per scan
- **Timestamp Storage** - Precise scan times
- **Quick Rescan** - Click history item to rescan

#### Advanced Search & Filters 🆕
- **Search Servers** - Filter by IP address or hostname
- **Status Filters** - Show all, online only, or offline only
- **Sort Options** - By recent, best latency, or most players
- **Toggle Interface** - Collapsible filter panel

### 🎨 User Experience

#### Theme System
- **Dark Mode** - Cyberpunk aesthetic with neon green accents
- **Light Mode** - Clean, professional design
- **Smooth Transitions** - Animated theme switching
- **LocalStorage Persistence** - Remembers user preference
- **Sun/Moon Toggle** - Easy theme switching in header

#### Responsive Design
- **Mobile Optimized** - Full functionality on smartphones
- **Tablet Support** - Adaptive layouts for all screen sizes
- **Desktop Enhanced** - Takes advantage of larger screens
- **Touch Friendly** - Large tap targets for mobile users

#### Professional UI
- **Glassmorphism Cards** - Frosted glass effect with backdrop blur
- **Neon Accents** - Vibrant green (#00ffa3) and purple (#7000ff)
- **Smooth Animations** - Framer Motion for entrance effects
- **Loading States** - Skeleton loaders during data fetch
- **Toast Notifications** - Real-time feedback for user actions
- **Error Handling** - Detailed error messages with troubleshooting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.11+
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cubestats.git
   cd cubestats
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file
   echo "MONGO_URL=mongodb://localhost:27017" > .env
   echo "DB_NAME=cubestats" >> .env
   echo "CORS_ORIGINS=http://localhost:3000" >> .env
   
   # Start the server
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   
   # Create .env file
   echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
   
   # Start the development server
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 📸 Screenshots

### Landing Page
![Landing Page](docs/landing.png)
*Clean, professional landing page with batch scan feature*

### Server Dashboard
![Server Results](docs/dashboard.png)
*Comprehensive server information with glassmorphism design*

### Performance Analytics
![Performance Charts](docs/analytics.png)
*Real-time latency and player count charts*

### Player Activity Log
![Activity Log](docs/activity.png)
*Track player join/leave events with playtime calculation*

### Batch Scan
![Batch Scan](docs/batch.png)
*Scan multiple servers simultaneously*

### Mobile View
![Mobile Responsive](docs/mobile.png)
*Fully responsive design for mobile devices*

---

## 🎯 Usage Guide

### Scanning a Server

**Single Server Scan:**
1. Enter server IP address (e.g., `mc.hypixel.net`)
2. Optionally specify port (defaults to 25565)
3. Click "SCAN" button
4. View comprehensive server information

**Batch Scan:**
1. Click "+" on BATCH SCAN card
2. Enter servers (one per line):
   ```
   mc.hypixel.net
   play.example.com:25565
   # Comment lines ignored
   ```
3. Click "SCAN ALL"
4. Monitor progress bar
5. View results summary

### Managing Favorites

1. Scan a server
2. Click "ADD TO FAVORITES" button
3. Access via "Favorites" in header
4. Click server to rescan
5. Remove with trash icon

### Tracking Player Activity

1. Scan a server with visible player lists
2. Click "REFRESH" multiple times
3. Watch activity log populate:
   - Green events = players joining
   - Red events = players leaving
   - See playtime for left players
4. View "Currently Playing" section for active sessions

### Using Categories

1. Scan any server
2. Find "CATEGORIES" card
3. Click quick tags or add custom
4. Tags save automatically
5. Remove with X button

### Performance Analytics

1. Scan a server multiple times
2. Performance data builds automatically
3. View latency trends over time
4. Monitor player count changes
5. See average metrics

---

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI library with hooks
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Recharts** - Chart visualization library
- **shadcn/ui** - Re-usable component library
- **Axios** - HTTP client
- **Sonner** - Toast notifications

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **HTTPX** - Async HTTP client
- **Python-dotenv** - Environment management

### Database
- **MongoDB** - NoSQL database for persistence
  - Server history
  - Favorites
  - Uptime tracking

### External APIs
- **mcsrvstat.us** - Minecraft server status API
- **PlayerDB** - Alternative player lookup (fallback)

---

## 📁 Project Structure

```
cubestats/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── ServerSearchBar.js
│   │   │   ├── StatusCard.js
│   │   │   ├── PlayersCard.js
│   │   │   ├── ServerInfoCard.js
│   │   │   ├── PluginsCard.js
│   │   │   ├── RawJsonViewer.js
│   │   │   ├── HistoryPanel.js
│   │   │   ├── FavoritesPanel.js
│   │   │   ├── ServerComparison.js
│   │   │   ├── ServerNotes.js
│   │   │   ├── ServerCategories.js
│   │   │   ├── PerformanceChart.js
│   │   │   ├── PlayerActivityLog.js
│   │   │   ├── BatchScan.js
│   │   │   ├── BulkExport.js
│   │   │   ├── AdvancedFilters.js
│   │   │   ├── LoadingSkeleton.js
│   │   │   └── ErrorDisplay.js
│   │   ├── contexts/
│   │   │   └── ThemeContext.js  # Theme management
│   │   ├── utils/
│   │   │   └── minecraftColors.js  # MOTD parser
│   │   ├── App.js             # Main application
│   │   ├── index.js           # Entry point
│   │   ├── App.css            # Custom styles
│   │   └── index.css          # Global styles
│   ├── package.json           # Node dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── .env                   # Environment variables
├── README.md                  # This file
└── LICENSE                    # MIT License
```

---

## 🔌 API Endpoints

### Backend Endpoints

#### `POST /api/server/scan`
Scan a Minecraft server
```json
{
  "ip": "mc.hypixel.net",
  "port": 25565
}
```
**Response:**
```json
{
  "success": true,
  "online": true,
  "latency": 523.45,
  "data": { /* server data */ }
}
```

#### `GET /api/server/history`
Get recently scanned servers (last 50)

#### `GET /api/server/uptime/{ip}/{port}`
Get 30-day uptime statistics
**Response:**
```json
{
  "uptime_percentage": 95.5,
  "total_scans": 100,
  "successful_scans": 95,
  "failed_scans": 5,
  "average_latency": 345.2
}
```

#### `GET /api/favorites`
Get all favorite servers

#### `POST /api/favorites/add`
Add a server to favorites

#### `DELETE /api/favorites/remove/{server_id}`
Remove a server from favorites

---

## 🎨 Design System

### Color Palette
- **Primary**: `#00ffa3` (Neon Green) - Main actions, online status, charts
- **Secondary**: `#7000ff` (Purple) - Accents, mods, highlights
- **Accent**: `#00d4ff` (Cyan) - Progress bars, badges
- **Background**: `#050505` (Deep Black) - Dark mode base
- **Surface**: `#0a0a0a` (Charcoal) - Card backgrounds
- **Destructive**: `#ff0055` (Red) - Offline status, errors, leave events

### Typography
- **Headings**: JetBrains Mono (Monospace)
- **Body**: Inter (Sans-serif)
- **Display**: Space Grotesk (Accent font)

### Design Principles
- **Glassmorphism** - Frosted glass cards with backdrop blur
- **Neon Accents** - Glowing effects on interactive elements
- **Grid Patterns** - Subtle background textures
- **Smooth Animations** - Entrance, hover, and transition effects
- **Responsive Layouts** - Mobile-first design approach

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [mcsrvstat.us](https://mcsrvstat.us/) - Free Minecraft server status API
- [PlayerDB](https://playerdb.co/) - Alternative player lookup service
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Chart visualization library

---

## 📧 Contact

Made with ♡ by **Lunar Vibes**

- Website: [cubestats.io](https://cubestats.io)
- GitHub: [@lunarvibes](https://github.com/lunarvibes)
- Twitter: [@lunar_vibes](https://twitter.com/lunar_vibes)

---

## 🌟 Features Roadmap

### Coming Soon
- [ ] Email/Webhook alerts for server downtime
- [ ] Export reports as PDF
- [ ] Advanced comparison charts
- [ ] Server recommendations based on preferences
- [ ] Multi-server dashboard view
- [ ] Performance benchmarking
- [ ] Player statistics aggregation
- [ ] Custom alert thresholds

### Future Enhancements
- [ ] Discord bot integration
- [ ] Mobile app (React Native)
- [ ] Server clustering analysis
- [ ] Machine learning predictions
- [ ] Community server directory

---

<div align="center">
  <p>⭐ Star this repo if you find it useful!</p>
  <p>© 2026 Cube Stats. Made with ♡ by Lunar Vibes</p>
</div>
