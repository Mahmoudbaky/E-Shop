# Modern E-commerce Platform

A full-featured e-commerce solution built with Next.js, providing a seamless shopping experience with multiple payment options.

![image](https://github.com/user-attachments/assets/7c109c8d-deea-46b1-a685-80781bc73735)


## Features

- 🛍️ **Complete Shopping Experience**: Product listings, categories, search, filters, and cart management
- 💳 **Multiple Payment Options**: Integration with PayPal, Stripe, and Cash on Delivery
- 🔐 **User Authentication**: Secure login, registration, and profile management
- 🖼️ **Image Management**: Upload and optimize product images via UploadThing
- 📧 **Automated Emails**: Order confirmations and receipts using Resend
- 📱 **Responsive Design**: Optimized for all device sizes with Tailwind CSS
- 🔍 **SEO Friendly**: Optimized for search engines with dynamic metadata
- 🚀 **Fast Performance**: Server-side rendering and optimized assets

## Tech Stack

- **Frontend Framework**: Next.js
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Image Uploads**: UploadThing
- **Email Service**: Resend
- **Payment Processing**: PayPal & Stripe

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL
- npm or yarn
- PayPal Developer Account
- Stripe Account
- Resend Account
- UploadThing Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mahmoudbaky/E-Shop.git
cd E-Shop
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```
# Create a .env.local file with the following variables
NEXT_PUBLIC_APP_NAME = "The-name-you-like"
NEXT_PUBLIC_APP_DESCRIPTION = "The description you like"
NEXT_PUBLIC_SERVER_URL = "http://localhost:3000"

DATABASE_URL="postgresql database url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_URL_INTERNAL = "http://localhost:3000"

# Payment methods
PAYMENT_METHODS = "PayPal, Stripe, CashOnDelivery"
DEFAULT_PAYMENT_METHOD = "PayPal"

# Payment providers
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

PAYPAL_API_URL = "https://api-m.sandbox.paypal.com"
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Email
RESEND_API_KEY="your-resend-api-key"
SENDER_EMAIL = "Sender-email"

# Image uploads
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
UPLOADTHING_TOKEN="your-uploadthing-token"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── (auth)/           # Authentication pages
│   ├── (shop)/           # Shop pages
│   ├── admin/            # Admin dashboard
│   └── user/             # User profile
├── components/           # Reusable UI components
├── db/                   # Contains prisma client
├── email/                # resend configurations
├── hooks/                # custom hooks
├── lib/                  # Utility functions and shared code
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── test/                 # unit test code using jest
└── types/                # TypeScript types
```

## Core Functionality

### Product Management
- Create, update, and delete products
- Categorize products
- Manage inventory
- Set pricing and discounts

### User Journey
- Browse products by category
- Search and filter products
- Add items to cart
- Checkout process
- Order tracking

### Admin Dashboard
- Order management
- Customer management
- Analytics and reporting
- Inventory management

## Deployment

This application can be deployed to Vercel with minimal configuration:

```bash
npm run build
# or
vercel
```

## Environment Variables for Production

Ensure all the required environment variables are set in your production environment.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Stripe](https://stripe.com/)
- [PayPal](https://developer.paypal.com/)
- [UploadThing](https://uploadthing.com/)
- [Resend](https://resend.io/)
