export type PetStatus = "lost" | "found";
export type PetSpecies = "cat" | "dog" | "other";
export type PetSex = "male" | "female" | "unknown";
export type PetAge = "baby" | "young" | "adult" | "senior";
export type PetSize = "small" | "medium" | "large";

export type PostPhoto = {
  id: string;
  url: string;
  position: number;
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorCity: string | null;
  authorShowWhatsapp: boolean;
  authorWhatsapp: string | null;
  status: PetStatus;
  species: PetSpecies;
  petName: string | null;
  sex: PetSex;
  age: PetAge | null;
  size: PetSize | null;
  description: string;
  locationLabel: string;
  lat: number | null;
  lng: number | null;
  searchRadiusKm: number;
  eventDate: string | null;
  resolvedAt: string | null;
  createdAt: string;
  photos: PostPhoto[];
  distanceKm: number | null;
};

export type Profile = {
  id: string;
  name: string;
  city: string | null;
  whatsapp: string | null;
  showWhatsapp: boolean;
  createdAt: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  profile: Profile;
};

export type ConversationSummary = {
  id: string;
  postId: string;
  postTitle: string;
  postPhoto: string | null;
  postStatus: PetStatus;
  otherId: string;
  otherName: string;
  otherCity: string | null;
  otherShowWhatsapp: boolean;
  otherWhatsapp: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type ConversationContext = {
  conversation: {
    id: string;
    postId: string;
    ownerId: string;
    interestedId: string;
    createdAt: string;
  };
  other: {
    id: string;
    name: string;
    city: string | null;
    showWhatsapp: boolean;
    whatsapp: string | null;
  };
  post: Post;
  messages: ChatMessage[];
};

export type ExploreFilters = {
  status: PetStatus;
  species: PetSpecies | "all";
  sex: PetSex | "all";
  age: PetAge | "all";
  size: PetSize | "all";
};

export type PostFilters = {
  status: PetStatus;
  species?: PetSpecies;
  sex?: PetSex;
  age?: PetAge;
  size?: PetSize;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  viewerId?: string;
};
