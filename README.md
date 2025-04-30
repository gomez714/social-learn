# Social Learn - AI-Powered Social Learning Platform

> **Note**: This project is currently a work in progress. The features listed below represent the current state of development.

Social Learn is a modern social learning platform that combines the power of artificial intelligence with social networking to create an engaging educational experience. Connect with learners, share knowledge, and grow together in a collaborative environment.

## Current Features

### User Profiles
- Create and customize your profile
- Upload and change profile avatars
- Edit personal information
- View follower and following counts
- Add a bio to your profile
- View other users' profiles and posts

### Social Networking
- Follow other users to stay connected
- View posts from users you follow
- Track follower and following statistics
- Build your learning network
- Discover new users to follow through recommendations
- View trending topics and discussions

### Content Sharing
- Create text-based posts
- Share images and videos
- Engage with other users' content
- Like and comment on posts
- Bookmark posts for later reference

### Messaging
- Real-time direct messaging between users
- Group chat functionality
- Message notifications
- Unread message indicators
- Message history and persistence
- Rich media support in messages

### Notifications
- Real-time notifications for:
  - New followers
  - Post likes
  - Comments on your posts
  - New messages
- Unread notification count
- Mark notifications as read
- Notification history

### Bookmarks
- Save posts for later reference
- Access your bookmarked posts
- Organize your saved content

### User Interface
- Responsive design for all devices
- Dark and light mode support
- Infinite scroll for content feeds
- Loading skeletons for better UX
- Modern and intuitive navigation
- Real-time updates

## Planned Features
- AI-powered content recommendations
- Learning path suggestions
- Interactive learning tools
- Community challenges and rewards
- Advanced analytics for learning progress
- Study rooms with collaborative features

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gomez714/social-learn
cd social-learn
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="your_postgresql_connection_string"
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
STREAM_API_KEY="your_stream_api_key"
STREAM_API_SECRET="your_stream_api_secret"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technology Stack

- **Frontend**: Next.js, React
- **Styling**: Tailwind CSS
- **Authentication**: Lucia Auth
- **Database**: PostgreSQL with Prisma ORM
- **Media Storage**: UploadThings
- **Real-time Features**: Stream Chat
- **State Management**: React Query
- **UI Components**: shadcn/ui
- **Icons**: Lucide Icons

## Contributing

We welcome contributions to improve Social Learn! Please feel free to submit a Pull Request.

## License

[Your chosen license]

## Contact

[Your contact information]
