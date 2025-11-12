# IGrow Rentals Lead Management System

A modern, secure lead management dashboard for tracking and analyzing marketing campaign leads from Google Sheets.

## Features

- 📊 **Real-time Dashboard** - Visual insights into lead metrics and performance
- 🔐 **Secure Authentication** - Role-based access control (Admin, Team, Client)
- 📈 **Analytics** - Comprehensive lead analytics and conversion tracking
- 🔄 **Google Sheets Integration** - Automatic sync with your lead data
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Untitled UI components

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Library**: Untitled UI (Tailwind CSS, React Aria)
- **Authentication**: NextAuth.js
- **Data Source**: Google Sheets API
- **Charts**: Recharts
- **Styling**: Tailwind CSS v4

## Prerequisites

- Node.js 18+ or Bun
- Google Cloud Project with Sheets API enabled
- Google Service Account credentials

## Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
# or
bun install
\`\`\`

### 2. Configure Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and click "Create"
   - Grant it the "Editor" role
   - Click "Done"
5. Create a JSON key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" and click "Create"
   - Save the downloaded JSON file securely
6. Share your Google Sheet with the service account email

### 3. Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update [.env.local](.env.local) with your credentials:

\`\`\`env
# Application
NEXT_PUBLIC_APP_NAME="IGrow Rentals LMS"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32

# Google Sheets API
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEET_ID="your-sheet-id-here"
\`\`\`

**Finding your Google Sheet ID:**
- Open your Google Sheet
- The ID is in the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### 4. Google Sheet Format

Your Google Sheet should have these columns (adjust in [src/lib/google-sheets.ts](src/lib/google-sheets.ts) if different):

| Column | Description | Example |
|--------|-------------|---------|
| timestamp | When the lead was created | 2024-01-15 14:30:00 |
| name | Lead's full name | John Doe |
| email | Lead's email | john@example.com |
| phone | Lead's phone number | +1234567890 |
| source | Where the lead came from | facebook, instagram, google, landing_page, chatbot |
| status | Current lead status | new, contacted, qualified, converted, lost |
| message | Lead's message/inquiry | Interested in 3BR property |
| interested_in | What they're interested in | Rental property |
| assigned_to | Who's handling this lead | Agent Name |
| notes | Additional notes | Follow up on Friday |

### 5. Run Development Server

\`\`\`bash
npm run dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Login

Use one of these demo accounts:

- **Admin**: admin@igrowrentals.com / admin123
- **Team**: team@igrowrentals.com / team123
- **Client**: client@igrowrentals.com / client123

## Project Structure

\`\`\`
igrow-lms/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/          # Login page
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── leads/          # Leads management
│   │   │   └── analytics/      # Analytics page
│   │   └── api/
│   │       ├── auth/           # NextAuth routes
│   │       └── leads/          # Lead API endpoints
│   ├── components/             # React components
│   │   ├── ui/                 # Untitled UI components
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts            # Authentication config
│   │   ├── google-sheets.ts   # Google Sheets integration
│   │   └── analytics.ts       # Analytics utilities
│   ├── types/
│   │   └── lead.ts            # TypeScript types
│   └── providers/             # React providers
├── .env.local                 # Environment variables
└── package.json
\`\`\`

## Customization

### Adding Custom Fields

If your Google Sheet has additional columns, update the mapping in [src/lib/google-sheets.ts](src/lib/google-sheets.ts#L50-L80):

\`\`\`typescript
return {
  id: leadData.id || \`lead-\${Date.now()}-\${index}\`,
  timestamp: new Date(leadData.timestamp),
  name: leadData.name,
  // Add your custom fields here
  customFields: {
    yourField: leadData.your_field,
  },
};
\`\`\`

### Changing User Accounts

Update the users array in [src/lib/auth.ts](src/lib/auth.ts#L13-L33). In production, replace this with a database.

### Modifying Dashboard Metrics

Edit the calculations in [src/lib/analytics.ts](src/lib/analytics.ts) to add or modify metrics.

## Security Best Practices

- ✅ **Server-side API calls** - Google Sheets credentials never exposed to client
- ✅ **Authentication required** - All dashboard routes protected
- ✅ **Role-based access** - Different permissions for admin/team/client
- ✅ **Environment variables** - Sensitive data in .env.local (not committed)
- ⚠️ **Production todos**:
  - Replace in-memory user store with database
  - Use bcrypt for password hashing
  - Add rate limiting
  - Enable HTTPS
  - Set up proper database for lead caching

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- AWS Amplify
- Netlify
- Railway
- DigitalOcean App Platform

## Next Steps

1. **Add Lead Details Page** - View individual lead information
2. **Add Lead Editing** - Update lead status and notes
3. **Add Filtering & Search** - Advanced lead filtering
4. **Add Charts** - Implement Recharts visualizations
5. **Add Notifications** - Email alerts for new leads
6. **Add Export** - Export leads to CSV/PDF
7. **Add Database** - Cache leads locally for faster access
8. **Add Real-time Updates** - WebSocket or polling for live data

## Support

For issues or questions:
- Check the [Google Sheets API docs](https://developers.google.com/sheets/api)
- Check the [NextAuth.js docs](https://next-auth.js.org/)
- Check the [Untitled UI docs](https://www.untitledui.com/react/docs)

## License

This project is private and proprietary to IGrow Rentals.
