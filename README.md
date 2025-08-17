# 🎨 Whiteboard - Interactive Digital Canvas

A modern, feature-rich digital whiteboard application built with Next.js 15, React 19, and Konva.js. Create, draw, collaborate, and export your ideas seamlessly.

![Whiteboard Screenshot](https://img.shields.io/badge/Status-Development-blue)

## ✨ Features

### 🎯 Drawing Tools

- **Pen Tool**: Freehand drawing with customizable colors and stroke width
- **Eraser**: Remove unwanted elements from your canvas
- **Text Tool**: Add text elements with customizable fonts and sizes
- **Shape Tools**: Create rectangles, circles, lines, and arrows
- **Selection Tool**: Select, move, and manipulate elements

### 🎨 Customization

- Multiple color options for drawing and shapes
- Adjustable stroke width for drawing tools
- Font customization for text elements
- Zoom and pan functionality for detailed work

### 💾 Export & Sharing

- Export whiteboard as **PNG**, **JPEG**, or **SVG**
- **PDF export** for professional sharing
- **Copy to clipboard** functionality
- High-quality image rendering

### 🏗️ Technical Features

- Real-time canvas rendering with Konva.js
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Modern React patterns with hooks and context
- Authentication system ready (login/auth routes)
- Dashboard layout for future features

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sahedulislamrony/whiteboard.git
   cd whiteboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

### Core Technologies

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework

### Canvas & Drawing

- **Konva.js** - HTML5 2D canvas library
- **React-Konva** - React wrapper for Konva
- **Fabric.js** - Additional canvas utilities

### UI Components

- **Radix UI** - Headless UI components
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications
- **Next Themes** - Theme management

### Export & Utilities

- **jsPDF** - PDF generation
- **html2canvas** - Canvas to image conversion
- **Class Variance Authority** - Component styling

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard layout
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── WhiteboardCanvas.tsx
│   └── WhiteboardToolbar.tsx
├── contexts/             # React contexts
│   └── WhiteboardContext.tsx
├── hooks/                # Custom hooks
│   └── useWhiteboard.ts
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
    └── export.ts         # Export functionality
```

## 🎯 Usage

### Basic Drawing

1. Select a tool from the toolbar (pen, shapes, text)
2. Choose your preferred color and stroke width
3. Start drawing on the canvas
4. Use the eraser to remove unwanted elements

### Working with Shapes

1. Select a shape tool (rectangle, circle, line, arrow)
2. Click and drag to create the shape
3. Customize color and stroke properties
4. Use the selection tool to modify existing shapes

### Adding Text

1. Select the text tool
2. Click where you want to add text
3. Type your content
4. Customize font size and color

### Exporting Your Work

1. Use the export button in the toolbar
2. Choose your preferred format (PNG, JPEG, SVG, PDF)
3. The file will be automatically downloaded

## 🧩 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- **WhiteboardCanvas**: Main canvas component using Konva
- **WhiteboardToolbar**: Tool selection and settings
- **WhiteboardContext**: Global state management
- **Export utilities**: Handle various export formats

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sahedulislamrony/whiteboard)

### Other Deployment Options

- **Netlify**: Connect your GitHub repository
- **Railway**: Deploy with railway.app
- **Docker**: Use the included Dockerfile (if available)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ by [Sahedul Islam Rony](https://github.com/sahedulislamrony)**
