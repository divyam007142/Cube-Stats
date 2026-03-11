import requests
import sys
import json
from datetime import datetime

class MCServerScoutAPITester:
    def __init__(self, base_url="https://server-scanner-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED")
        else:
            print(f"❌ {name}: FAILED - {details}")
        
        self.test_results.append({
            "test": name,
            "status": "PASSED" if success else "FAILED",
            "details": details
        })
        return success

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.text[:100]}"
            return self.log_test("API Root", success, details)
        except Exception as e:
            return self.log_test("API Root", False, str(e))

    def test_scan_valid_server(self):
        """Test scanning a valid Minecraft server (Hypixel)"""
        try:
            payload = {"ip": "mc.hypixel.net", "port": 25565}
            response = requests.post(f"{self.api_url}/server/scan", json=payload, timeout=30)
            
            if response.status_code != 200:
                return self.log_test("Scan Valid Server", False, f"HTTP {response.status_code}: {response.text[:200]}")
                
            data = response.json()
            
            # Check response structure
            if not data.get('success'):
                return self.log_test("Scan Valid Server", False, f"API returned success=False: {data}")
            
            if not data.get('online'):
                return self.log_test("Scan Valid Server", False, f"Server reported as offline: {data}")
            
            # Validate data structure
            server_data = data.get('data', {})
            required_fields = ['ip', 'port', 'online']
            for field in required_fields:
                if field not in server_data:
                    return self.log_test("Scan Valid Server", False, f"Missing required field: {field}")
            
            return self.log_test("Scan Valid Server", True, f"Server online: {server_data.get('ip')}:{server_data.get('port')}")
            
        except Exception as e:
            return self.log_test("Scan Valid Server", False, str(e))

    def test_scan_invalid_server(self):
        """Test scanning an invalid server"""
        try:
            payload = {"ip": "fake.server.invalid", "port": 25565}
            response = requests.post(f"{self.api_url}/server/scan", json=payload, timeout=30)
            
            if response.status_code != 200:
                return self.log_test("Scan Invalid Server", False, f"HTTP {response.status_code}: {response.text[:200]}")
                
            data = response.json()
            
            # Invalid server should return success=False and online=False
            if data.get('success') is False and data.get('online') is False:
                return self.log_test("Scan Invalid Server", True, "Correctly identified invalid server")
            else:
                return self.log_test("Scan Invalid Server", False, f"Unexpected response for invalid server: {data}")
                
        except Exception as e:
            return self.log_test("Scan Invalid Server", False, str(e))

    def test_get_history(self):
        """Test getting server history"""
        try:
            response = requests.get(f"{self.api_url}/server/history", timeout=10)
            
            if response.status_code != 200:
                return self.log_test("Get History", False, f"HTTP {response.status_code}: {response.text[:200]}")
            
            data = response.json()
            
            # Should return a list (even if empty)
            if not isinstance(data, list):
                return self.log_test("Get History", False, f"Expected list, got: {type(data)}")
            
            return self.log_test("Get History", True, f"Retrieved {len(data)} history items")
            
        except Exception as e:
            return self.log_test("Get History", False, str(e))

    def test_favorites_workflow(self):
        """Test complete favorites workflow: add, get, remove"""
        test_server = {"ip": "test.example.com", "port": 25565}
        favorite_id = None
        
        try:
            # 1. Add to favorites
            response = requests.post(f"{self.api_url}/favorites/add", json=test_server, timeout=10)
            if response.status_code != 200:
                return self.log_test("Add Favorite", False, f"HTTP {response.status_code}: {response.text[:200]}")
                
            add_data = response.json()
            if not add_data.get('success'):
                return self.log_test("Add Favorite", False, f"Failed to add favorite: {add_data}")
            
            favorite_id = add_data.get('id')
            if not favorite_id:
                return self.log_test("Add Favorite", False, "No ID returned for favorite")
            
            print(f"✅ Add Favorite: PASSED - ID: {favorite_id}")
            
            # 2. Get favorites list
            response = requests.get(f"{self.api_url}/favorites", timeout=10)
            if response.status_code != 200:
                return self.log_test("Get Favorites", False, f"HTTP {response.status_code}: {response.text[:200]}")
            
            favorites_data = response.json()
            if not isinstance(favorites_data, list):
                return self.log_test("Get Favorites", False, f"Expected list, got: {type(favorites_data)}")
            
            # Check if our test server is in the list
            found = any(fav.get('ip') == test_server['ip'] and fav.get('port') == test_server['port'] 
                      for fav in favorites_data)
            if not found:
                return self.log_test("Get Favorites", False, "Added server not found in favorites list")
                
            print(f"✅ Get Favorites: PASSED - Found {len(favorites_data)} favorites")
            
            # 3. Remove from favorites
            response = requests.delete(f"{self.api_url}/favorites/remove/{favorite_id}", timeout=10)
            if response.status_code != 200:
                return self.log_test("Remove Favorite", False, f"HTTP {response.status_code}: {response.text[:200]}")
            
            remove_data = response.json()
            if not remove_data.get('success'):
                return self.log_test("Remove Favorite", False, f"Failed to remove favorite: {remove_data}")
            
            print(f"✅ Remove Favorite: PASSED")
            
            self.tests_run += 2  # Add and Remove (Get was already counted)
            self.tests_passed += 2
            
            return True
            
        except Exception as e:
            return self.log_test("Favorites Workflow", False, str(e))

    def test_invalid_endpoints(self):
        """Test error handling for invalid endpoints"""
        try:
            # Test invalid server ID for removal
            response = requests.delete(f"{self.api_url}/favorites/remove/invalid-id", timeout=10)
            
            if response.status_code == 404:
                return self.log_test("Invalid Favorite Removal", True, "Correctly returned 404 for invalid ID")
            else:
                return self.log_test("Invalid Favorite Removal", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            return self.log_test("Invalid Favorite Removal", False, str(e))

    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🔍 Starting MC Server Scout API Tests")
        print(f"📡 Testing API at: {self.api_url}")
        print("-" * 50)
        
        # Basic connectivity
        self.test_api_root()
        
        # Core server scanning functionality
        self.test_scan_valid_server()
        self.test_scan_invalid_server()
        
        # History functionality
        self.test_get_history()
        
        # Favorites functionality (complete workflow)
        self.test_favorites_workflow()
        
        # Error handling
        self.test_invalid_endpoints()
        
        # Results summary
        print("-" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return 0
        else:
            print("❌ Some backend tests failed!")
            return 1

def main():
    tester = MCServerScoutAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())