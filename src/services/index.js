import PersistenceFactory from "../dao/PersistenceFactory.js";

import UsersRepository from "./repositories/usersRepository.js";
import CartsRepository from "./repositories/cartsRepository.js";
import ProductsRepository from "./repositories/productsRepository.js";
import TicketsRepository from "./repositories/ticketsRepository.js";

const {UsersDao, ProductsDao, CartsDao, TicketsDao} = await PersistenceFactory.getPersistence();

export const usersService = new UsersRepository(new UsersDao());
export const cartsService = new CartsRepository(new CartsDao());
export const productsService = new ProductsRepository(new ProductsDao());
export const ticketsService = new TicketsRepository(new TicketsDao());