import { NextFunction, Request, Response } from 'express';
import { User, UserSearch, UserType } from '../../models/types/user';
import { SelfSovereignIdentityService } from '../../services/ssi-service';
import * as _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { getDateFromString } from '../../utils/date';
import { AuthenticatedRequest } from '../../models/types/authentication';
import { AuthorizationService } from '../../services/authorization-service';
import { CreateIdentityBody } from '../../models/types/identity';

export class UserRoutes {
	private readonly ssiService: SelfSovereignIdentityService;
	private readonly authorizationService: AuthorizationService;
	constructor(ssiService: SelfSovereignIdentityService, authorizationService: AuthorizationService) {
		this.ssiService = ssiService;
		this.authorizationService = authorizationService;
	}

	searchUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userSearch = this.getUserSearch(req);
			const users = await this.ssiService.searchUsers(userSearch);
			res.send(users);
		} catch (error) {
			next(error);
		}
	};

	createIdentity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const createIdentityBody: CreateIdentityBody = req.body;
			const identity = await this.ssiService.createIdentity(createIdentityBody);

			res.status(StatusCodes.CREATED).send(identity);
		} catch (error) {
			next(error);
		}
	};

	getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = _.get(req, 'params.userId');

			if (_.isEmpty(userId)) {
				res.sendStatus(StatusCodes.BAD_REQUEST);
				return;
			}

			const user = await this.ssiService.getUser(userId);
			res.send(user);
		} catch (error) {
			next(error);
		}
	};

	addUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const user: User = req.body;
			const result = await this.ssiService.addUser(user);

			if (!result?.result?.n) {
				res.status(StatusCodes.NOT_FOUND).send({ error: 'could not add user!' });
				return;
			}

			res.sendStatus(StatusCodes.CREATED);
		} catch (error) {
			next(error);
		}
	};

	updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const user: User = req.body;

			const { isAuthorized, error } = await this.authorizationService.isAuthorized(req.user, user.userId);
			if (!isAuthorized) {
				throw error;
			}

			const result = await this.ssiService.updateUser(user);

			if (!result?.result?.n) {
				res.status(StatusCodes.NOT_FOUND).send({ error: 'No user found to update!' });
				return;
			}

			res.sendStatus(StatusCodes.OK);
		} catch (error) {
			next(error);
		}
	};

	deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = _.get(req, 'params.userId');
			if (_.isEmpty(userId)) {
				res.sendStatus(StatusCodes.BAD_REQUEST);
				return;
			}

			const { isAuthorized, error } = await this.authorizationService.isAuthorized(req.user, userId);
			if (!isAuthorized) {
				throw error;
			}

			await this.ssiService.deleteUser(userId);
			res.sendStatus(StatusCodes.OK);
		} catch (error) {
			next(error);
		}
	};

	getUserSearch = (req: Request): UserSearch => {
		const decodeParam = (param: string): string | undefined => (param ? decodeURI(param) : undefined);
		const type = decodeParam(<string>req.query.type);
		const organization = decodeParam(<string>req.query.organization);
		const username = decodeParam(<string>req.query.username);
		const verifiedParam = decodeParam(<string>req.query.verified);
		const registrationDate = decodeParam(<string>req.query['registration-date']);
		const verified = verifiedParam != null ? Boolean(verifiedParam) && verifiedParam == 'true' : undefined;
		const limitParam = parseInt(<string>req.query.limit, 10);
		const indexParam = parseInt(<string>req.query.index, 10);
		const limit = isNaN(limitParam) || limitParam == 0 ? undefined : limitParam;
		const index = isNaN(indexParam) ? undefined : indexParam;

		return {
			type: <UserType>type,
			index,
			limit,
			organization,
			verified,
			username,
			registrationDate: getDateFromString(registrationDate)
		};
	};
}
