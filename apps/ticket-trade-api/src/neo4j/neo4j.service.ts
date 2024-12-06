import { Injectable, OnModuleDestroy } from '@nestjs/common';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleDestroy {
  private driver: Driver;
  private readonly uri = 'neo4j+s://8782bfc1.databases.neo4j.io:7687';
  private readonly username = process.env.NEO4J_USER; 
  private readonly password = process.env.NEO4J_PASSWORD;

  constructor() {
    this.driver = neo4j.driver(
      this.uri,
      neo4j.auth.basic(this.username, this.password),
    );
  }

  getSession(): Session {
    return this.driver.session();
  }

  async onModuleDestroy() {
    await this.driver.close();
  }
}
