import { 
  User, 
  InsertUser, 
  MessageCollection, 
  InsertMessageCollection, 
  Message, 
  InsertMessage, 
  Flipbook, 
  InsertFlipbook 
} from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Collection operations
  createCollection(collection: InsertMessageCollection): Promise<MessageCollection>;
  getCollection(id: number): Promise<MessageCollection | undefined>;
  getCollectionBySlug(slug: string): Promise<MessageCollection | undefined>;
  getUserCollections(userId: number): Promise<MessageCollection[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesForCollection(collectionId: number): Promise<Message[]>;
  getMessageCount(collectionId: number): Promise<number>;
  
  // Flipbook operations
  createFlipbook(flipbook: InsertFlipbook): Promise<Flipbook>;
  getFlipbook(id: number): Promise<Flipbook | undefined>;
  getUserFlipbooks(userId: number): Promise<Flipbook[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private collections: Map<number, MessageCollection>;
  private messages: Map<number, Message>;
  private flipbooks: Map<number, Flipbook>;
  private userCurrentId: number;
  private collectionCurrentId: number;
  private messageCurrentId: number;
  private flipbookCurrentId: number;
  
  // Create a demo user
  private initializeDemoUser() {
    // Create a hashed password for our demo user
    // For simple testing, we're using a pre-hashed password (hashed version of "password123")
    const hashedPassword = "$2a$10$h.dl5J86rGH7I8bD9bZeZe";
    
    // Create and store the user
    const demoUser: User = {
      id: 1,
      username: 'testuser',
      password: hashedPassword,
      email: 'test@example.com',
      name: 'Test User',
      marketingOptIn: false,
      createdAt: new Date()
    };
    
    this.users.set(demoUser.id, demoUser);
    console.log('Demo user created - Username: testuser, Password: password123');
  }

  constructor() {
    this.users = new Map();
    this.collections = new Map();
    this.messages = new Map();
    this.flipbooks = new Map();
    this.userCurrentId = 1;
    this.collectionCurrentId = 1;
    this.messageCurrentId = 1;
    this.flipbookCurrentId = 1;
    
    // Demo user will be created with properly hashed password
    this.initializeDemoUser();
    
    // Add some demo collections for development
    this.collections.set(1, {
      id: 1,
      title: "End of School Year Memories",
      type: "end-of-school",
      slug: "end-of-school-2023",
      status: "active",
      userId: 1,
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      goal: 50,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    });
    
    this.collections.set(2, {
      id: 2,
      title: "Championship Basketball Team",
      type: "sporting-season",
      slug: "basketball-champs-2023",
      status: "active",
      userId: 1,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      goal: 30,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    });
    
    this.collections.set(3, {
      id: 3,
      title: "Birthday Wishes Collection",
      type: "birthday",
      slug: "birthday-wishes",
      status: "active",
      userId: 1,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      goal: null,
      createdAt: new Date(),
    });
    this.collectionCurrentId = 3;
    
    // Add some demo messages
    this.messages.set(1, {
      id: 1,
      content: "You've been the most inspiring teacher I've ever had. Thank you for making our final year so special!",
      fromName: "Emma Johnson",
      collectionId: 1,
      hasVoice: false,
      voiceUrl: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    });
    
    this.messages.set(2, {
      id: 2,
      content: "Mrs. Smith, you've made math fun and engaging all year. I never thought I'd enjoy algebra, but you changed that!",
      fromName: "Alex Thompson",
      collectionId: 1,
      hasVoice: false,
      voiceUrl: null,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    });
    
    this.messages.set(3, {
      id: 3,
      content: "Thanks for all the extra help during study hall. It really made a difference in my grades and confidence.",
      fromName: "Michael Rodriguez",
      collectionId: 1,
      hasVoice: false,
      voiceUrl: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    });
    
    this.messages.set(4, {
      id: 4,
      content: "Coach, your dedication to our team is what got us through the season. Thanks for pushing us to be our best!",
      fromName: "Jason Miller",
      collectionId: 2,
      hasVoice: false,
      voiceUrl: null,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      marketingOptIn: insertUser.marketingOptIn || false,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Collection operations
  async createCollection(insertCollection: InsertMessageCollection): Promise<MessageCollection> {
    const id = this.collectionCurrentId++;
    const now = new Date();
    
    const collection: MessageCollection = {
      ...insertCollection,
      id,
      createdAt: now,
      status: "active"
    };
    
    this.collections.set(id, collection);
    return collection;
  }

  async getCollection(id: number): Promise<MessageCollection | undefined> {
    return this.collections.get(id);
  }

  async getCollectionBySlug(slug: string): Promise<MessageCollection | undefined> {
    return Array.from(this.collections.values()).find(
      (collection) => collection.slug === slug,
    );
  }

  async getUserCollections(userId: number): Promise<MessageCollection[]> {
    return Array.from(this.collections.values()).filter(
      (collection) => collection.userId === userId,
    );
  }

  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const now = new Date();
    
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: now,
      hasVoice: insertMessage.hasVoice || false,
      voiceUrl: insertMessage.voiceUrl || null
    };
    
    this.messages.set(id, message);
    return message;
  }

  async getMessagesForCollection(collectionId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.collectionId === collectionId,
    );
  }

  async getMessageCount(collectionId: number): Promise<number> {
    return (await this.getMessagesForCollection(collectionId)).length;
  }

  // Flipbook operations
  async createFlipbook(insertFlipbook: InsertFlipbook): Promise<Flipbook> {
    const id = this.flipbookCurrentId++;
    const now = new Date();
    
    const flipbook: Flipbook = {
      ...insertFlipbook,
      id,
      createdAt: now,
      status: "active"
    };
    
    this.flipbooks.set(id, flipbook);
    return flipbook;
  }

  async getFlipbook(id: number): Promise<Flipbook | undefined> {
    return this.flipbooks.get(id);
  }

  async getUserFlipbooks(userId: number): Promise<Flipbook[]> {
    const userCollections = await this.getUserCollections(userId);
    const userCollectionIds = userCollections.map(collection => collection.id);
    
    return Array.from(this.flipbooks.values()).filter(
      (flipbook) => userCollectionIds.includes(flipbook.collectionId),
    );
  }
}

export const storage = new MemStorage();
