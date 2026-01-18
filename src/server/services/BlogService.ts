import { BlogPostModel } from '../models/BlogPostModel';
import { Database } from '../config/database';
import { MockDataService } from './MockDataService';
import type { IBlogPost } from '../../shared/interfaces';

export class BlogService {
  private useMockData(): boolean {
    return !Database.getInstance().isConnectedToDb();
  }

  public async getAll(): Promise<IBlogPost[]> {
    if (this.useMockData()) {
      return MockDataService.getAllBlogPosts();
    }
    return await BlogPostModel.findAll();
  }

  public async getPublished(): Promise<IBlogPost[]> {
    if (this.useMockData()) {
      return MockDataService.getPublishedBlogPosts();
    }
    return await BlogPostModel.findPublished();
  }

  public async getById(id: string): Promise<IBlogPost> {
    if (this.useMockData()) {
      const post = MockDataService.getBlogPostById(id);
      if (!post) throw new Error('Blog post not found');
      return post;
    }
    const post = await BlogPostModel.findById(id);
    if (!post) {
      throw new Error('Blog post not found');
    }
    return post;
  }

  public async getBySlug(slug: string): Promise<IBlogPost> {
    if (this.useMockData()) {
      const post = MockDataService.getBlogPostBySlug(slug);
      if (!post) throw new Error('Blog post not found');
      return post;
    }
    const post = await BlogPostModel.findBySlug(slug);
    if (!post) {
      throw new Error('Blog post not found');
    }
    return post;
  }

  public async create(data: Partial<IBlogPost>): Promise<IBlogPost> {
    if (this.useMockData()) {
      return MockDataService.createBlogPost(data);
    }
    return await BlogPostModel.create(data);
  }

  public async update(id: string, data: Partial<IBlogPost>): Promise<IBlogPost> {
    if (this.useMockData()) {
      const post = MockDataService.updateBlogPost(id, data);
      if (!post) throw new Error('Blog post not found');
      return post;
    }
    const post = await BlogPostModel.update(id, data);
    if (!post) {
      throw new Error('Blog post not found');
    }
    return post;
  }

  public async delete(id: string): Promise<void> {
    if (this.useMockData()) {
      const deleted = MockDataService.deleteBlogPost(id);
      if (!deleted) throw new Error('Blog post not found');
      return;
    }
    const deleted = await BlogPostModel.delete(id);
    if (!deleted) {
      throw new Error('Blog post not found');
    }
  }
}