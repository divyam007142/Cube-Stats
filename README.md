# CubeStats 🎮

<div align="center">
  <img src="https://customer-assets.emergentagent.com/job_server-scanner-3/artifacts/o9g0ldxd_cubestats_logo-removebg-preview.png" alt="CubeStats Logo" width="120"/>
  
  <h3>Professional Minecraft Server Scanner</h3>
  <p>Get detailed information about any Minecraft server with a beautiful, futuristic interface</p>

  [![Made with React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4.5.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

---

## ✨ Features

### Core Features
- 🔍 **Server Scanning** - Real-time server status and detailed information
- 👥 **Player Tracking** - View online players, max capacity, and player lists
- 🎨 **MOTD Rendering** - Properly displays Minecraft color codes
- 🖼️ **Server Icons** - Shows server favicon/icon
- 📊 **Server Stats** - Version, protocol, software, and more
- 🔌 **Plugins & Mods** - Displays installed plugins and mods (when available)

### Advanced Features
- ⭐ **Favorites System** - Save your favorite servers for quick access
- 📜 **History Tracking** - Keep track of recently scanned servers
- 📊 **Server Comparison** - Compare multiple servers side-by-side
- 📝 **Server Notes** - Add custom notes for each server
- 🔄 **Auto-Refresh** - Automatically refresh server stats every 30 seconds
- 🔄 **Manual Refresh** - Refresh button to update stats on demand
- 📤 **Export Data** - Export server data as JSON
- 🔗 **Share Servers** - Generate shareable links
- 🕐 **Last Updated** - Timestamp showing when data was last refreshed
- 📱 **Responsive Design** - Beautiful UI on desktop, tablet, and mobile

### User Experience
- 🎯 **Professional Error Handling** - Clear error messages with troubleshooting tips
- 💀 **Loading States** - Smooth skeleton loaders
- 🎉 **Toast Notifications** - Real-time feedback for user actions
- 🌈 **Rich Animations** - Smooth transitions and micro-interactions
- 🎨 **Cyberpunk Theme** - Futuristic design with neon green accents

---

## 🖼️ Screenshots

### Landing Page
![Landing Page](https://customer-assets.emergentagent.com/job_server-scanner-3/artifacts/o9g0ldxd_cubestats_logo-removebg-preview.png)
*Clean, professional landing page with search functionality*

### Server Results
![Server Results](docs/screenshot_results.png)
*Detailed server information with glassmorphism cards*

### Server Comparison
![Server Comparison](docs/screenshot_comparison.png)
*Compare multiple favorite servers at once*

### Mobile Responsive
![Mobile View](docs/screenshot_mobile.png)
*Fully responsive design for mobile devices*

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

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **shadcn/ui** - Re-usable component library
- **Axios** - HTTP client
- **React Router** - Navigation
- **Sonner** - Toast notifications

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **HTTPX** - Async HTTP client
- **Python-dotenv** - Environment variable management

### Database
- **MongoDB** - NoSQL database for storing favorites and history

### External API
- **mcsrvstat.us** - Minecraft server status API

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
│   │   │   ├── LoadingSkeleton.js
│   │   │   └── ErrorDisplay.js
│   │   ├── utils/
│   │   │   └── minecraftColors.js  # MOTD color parser
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

## 🎨 Design System

### Color Palette
- **Primary**: `#00ffa3` (Neon Green) - Main actions, online status
- **Secondary**: `#7000ff` (Purple) - Accents, mods
- **Accent**: `#00d4ff` (Cyan) - Highlights
- **Background**: `#050505` (Deep Black)
- **Surface**: `#0a0a0a` (Charcoal)
- **Destructive**: `#ff0055` (Red) - Offline status, errors

### Typography
- **Headings**: JetBrains Mono (Monospace)
- **Body**: Inter (Sans-serif)
- **Accent**: Space Grotesk (Display)

### Effects
- Glassmorphism with backdrop blur
- Animated gradient orbs
- Grid pattern overlay
- Neon glow effects on primary elements
- Smooth transitions and micro-animations

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

#### `GET /api/server/history`
Get recently scanned servers

#### `GET /api/favorites`
Get all favorite servers

#### `POST /api/favorites/add`
Add a server to favorites
```json
{
  "ip": "mc.hypixel.net",
  "port": 25565
}
```

#### `DELETE /api/favorites/remove/{server_id}`
Remove a server from favorites

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
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

## 📧 Contact

Made with ♡ by **Lunar Vibes**

- Website: [cubestats.io](https://cubestats.io)
- GitHub: [@lunarvibes](https://github.com/lunarvibes)
- Twitter: [@lunar_vibes](https://twitter.com/lunar_vibes)

---

<div align="center">
  <p>⭐ Star this repo if you find it useful!</p>
  <p>© 2026 Cube Stats. Made with ♡ by Lunar Vibes</p>
</div>