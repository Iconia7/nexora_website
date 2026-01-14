# 🔷 Nexora Creative Solutions | Official Agency Website

![Nexora Banner](public/og-image.jpg)

[![Live Site](https://img.shields.io/badge/Live-View_Site-A7002A?style=for-the-badge&logo=vercel)](https://nexoracreatives.co.ke)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![M-Pesa](https://img.shields.io/badge/M--Pesa-Daraja_API-43A047?style=for-the-badge&logo=safaricom&logoColor=white)](https://developer.safaricom.co.ke/)

> **Transforming Ideas into Reality.** > The official web portal for Nexora Creative Solutions, a tech agency based in Thika, Kenya.

## 📖 About The Project

This repository contains the source code for **Nexora Creative Solutions**, a modern digital agency website built to showcase our services in Web Design, Mobile App Development, and Digital Branding.

Unlike standard portfolio sites, this project includes a **fully functional E-Commerce Store (Nexora Shop)** with a custom-built **M-Pesa STK Push payment gateway**, demonstrating our capability to build fintech-ready applications.

### 🌟 Key Features

* **🎨 Modern UI/UX:** Built with a "Glassmorphism" aesthetic using **Tailwind CSS** and **Framer Motion** for smooth, cinematic animations.
* **🛒 Nexora Shop:** A custom merch store featuring:
    * Persistent Cart (Local Storage).
    * **Direct M-Pesa Integration:** Users pay via STK Push directly on the site.
    * WhatsApp Receipt Generation.
* **⚡ Performance:** Optimized with **Vite** for lightning-fast load times (98+ Lighthouse Score).
* **🔍 Dynamic SEO:** Implemented `react-helmet-async` for page-specific metadata and canonical tags.
* **🔒 Security:** Configured with custom security headers (HSTS, X-Frame-Options) via `vercel.json` to prevent clickjacking and XSS.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS
* **Animations:** Framer Motion
* **State Management:** React Hooks (Context API)
* **Backend (Serverless):** Node.js (Vercel Serverless Functions)
* **Payments:** Safaricom Daraja API (M-Pesa Express)
* **Icons:** Lucide React

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/Iconia7/nexora_website.git](https://github.com/Iconia7/nexora_website.git)
    cd nexora_website
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Safaricom credentials:
    ```env
    # Safaricom Daraja API (Sandbox/Production)
    VITE_MPESA_CONSUMER_KEY=your_consumer_key
    VITE_MPESA_CONSUMER_SECRET=your_consumer_secret
    VITE_MPESA_PASSKEY=your_passkey
    VITE_MPESA_SHORTCODE=174379
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```bash
src/
├── assets/          # Images and static files
├── components/      # Reusable UI (Navbar, Footer, SEO, MpesaModal)
├── pages/           # Route pages (Home, Shop, About, etc.)
├── api/             # Serverless functions (stkpush.js, query.js)
├── data.js          # Static data for products/services
└── App.jsx          # Main application entry
```

## 💳 M-Pesa Integration Logic

The payment flow works as follows:
1. **User Trigger:** Customer clicks "Pay Now" in the Shop.
2. **Backend Request:** `api/stkpush.js` hits the Safaricom Daraja API to trigger an STK Push to the user's phone.
3. **User Action:** User enters their M-Pesa PIN.
4. **Verification:** The frontend polls `api/query.js` every 3 seconds to check payment status.
5. **Completion:** On success (`ResultCode: 0`), a receipt is generated and the order is finalized via WhatsApp.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

**Newton Mwangi** - Founder & Lead Developer

* **Email:** mwanginewton239@gmail.com
* **Portfolio:** [nexoracreatives.co.ke](https://nexoracreatives.co.ke)
* **LinkedIn:** [Newton Mwangi](https://linkedin.com/in/newton-mwangi)

---
*Built with ❤️ in Thika, Kenya by Nexora Creative Solutions.*
