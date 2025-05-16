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

  constructor() {
    this.users = new Map();
    this.collections = new Map();
    this.messages = new Map();
    this.flipbooks = new Map();
    this.userCurrentId = 1;
    this.collectionCurrentId = 1;
    this.messageCurrentId = 1;
    this.flipbookCurrentId = 1;
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
    const user: User = { ...insertUser, id };
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
