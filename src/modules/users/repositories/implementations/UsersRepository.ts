import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.createQueryBuilder("users")
    .leftJoinAndSelect("users.games", "games")
    .where("users.id = :id", { id: user_id })
    .getOne()
    if (user) {
      return user;
    }
    throw new Error("user not found");
    // Complete usando ORM
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
    SELECT * FROM USERS
    ORDER BY first_name
    ;`); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[]> {
    return this.repository.query(`
    SELECT * FROM users
    WHERE first_name ILIKE $1
    AND last_name ILIKE $2;
    `, [ first_name, last_name ]); // Complete usando raw query
  }
}
