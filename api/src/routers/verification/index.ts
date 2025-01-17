import { Router } from 'express';
import { CONFIG } from '../../config';
import {
	RevokeVerificationBodySchema,
	TrustedRootBodySchema,
	VerifiableCredentialBodySchema,
	VerifyIdentityBodySchema
} from '../../models/schemas/request-response-body/verification-bodies';
import { VerificationRoutes } from '../../routes/verification';
import { Logger } from '../../utils/logger';
import { authorizationService, verificationService } from '../services';
import { apiKeyMiddleware, authMiddleWare, validate } from '../middlewares';

const verificationRoutes = new VerificationRoutes(verificationService, authorizationService, CONFIG, Logger.getInstance());
const {
	createVerifiableCredential,
	checkVerifiableCredential,
	revokeVerifiableCredential,
	getLatestDocument,
	getTrustedRootIdentities,
	addTrustedRootIdentity,
	removeTrustedRootIdentity
} = verificationRoutes;

export const verificationRouter = Router();

/**
 * @openapi
 * /verification/latest-document/{identityId}:
 *   get:
 *     summary: Get the latest version of an identity document (DID)
 *     description: Get the latest version of an identity document (DID) from the IOTA Tangle.
 *     tags:
 *     - verification
 *     parameters:
 *     - name: identityId
 *       in: path
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/IdentityIdSchema'
 *       examples:
 *         identityId:
 *           value: did:iota:3tqQeyDeEmjjSgAWGa99qmhYgrse9mEX89QqgSwsrrWy
 *           summary: Example identity id (DID identifier)
 *     responses:
 *       200:
 *         description: Latest Identity document (DID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LatestIdentityJsonSchema"
 *       401:
 *         description: No valid api key provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 *       5XX:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
verificationRouter.get('/latest-document/:identityId', apiKeyMiddleware, getLatestDocument);

/**
 * @openapi
 * /verification/trusted-roots:
 *   post:
 *     summary: Adds Trusted Root identity identifiers (DIDs)
 *     description: Adds Trusted Root identity identifiers (DIDs). Trusted roots are DIDs of identities which are trusted by the Bridge. This identity DIDs can be DIDs of other organizations. By adding them to the list Trusted Roots their Verifiable Credentials (VCs) are automatically trusted when checking at the Bridge.
 *     tags:
 *     - verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TrustedRootBodySchema"
 *           example:
 *             trustedRoot: did:iota:3tqQeyDeEmjjSgAWGa99qmhYgrse9mEX89QqgSwsrrWy
 *     responses:
 *       200:
 *         description: Successful added trusted Root identity identifier.
 *       401:
 *         description: No valid api key provided / Not authenticated / Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 *       5XX:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
verificationRouter.post('/trusted-roots', apiKeyMiddleware, authMiddleWare, validate({ body: TrustedRootBodySchema }), addTrustedRootIdentity);

/**
 * @openapi
 * /verification/trusted-roots:
 *   get:
 *     summary: Returns a list of Trusted Root identity identifiers (DIDs)
 *     description: Returns a list of Trusted Root identity identifiers (DIDs). Trusted roots are DIDs of identities which are trusted by the Bridge. This identity DIDs can be DIDs of other organizations. By adding them to the list Trusted Roots their Verifiable Credentials (VCs) are automatically trusted when checking at the Bridge.
 *     tags:
 *     - verification
 *     responses:
 *       200:
 *         description: List of Trusted Root identity identifiers (DIDs).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trustedRoots:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: No valid api key provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 *       5XX:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
verificationRouter.get('/trusted-roots', apiKeyMiddleware, getTrustedRootIdentities);

/**
 * @openapi
 * /verification/trusted-roots:
 *   delete:
 *     summary: Remove Trusted Root identity identifiers (DIDs)
 *     description: Remove Trusted Root identity identifiers (DIDs). Trusted roots are DIDs of identities which are trusted by the Bridge. This identity DIDs can be DIDs of other organizations. By adding them to the list Trusted Roots their Verifiable Credentials (VCs) are automatically trusted when checking at the Bridge.
 *     tags:
 *     - verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TrustedRootBodySchema"
 *           example:
 *             trustedRoot: did:iota:3tqQeyDeEmjjSgAWGa99qmhYgrse9mEX89QqgSwsrrWy
 *     responses:
 *       200:
 *         description: Successful removed trusted Root identity identifier.
 *       401:
 *         description: No valid api key provided / Not authenticated / Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 *       5XX:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
verificationRouter.delete('/trusted-roots', apiKeyMiddleware, authMiddleWare, validate({ body: TrustedRootBodySchema }), removeTrustedRootIdentity);

/**
 * @openapi
 * /verification/create-credential:
 *   post:
 *     summary: Verify the authenticity of an identity and issue a credential
 *     description: Verify the authenticity of an identity (of an individual, organization or object) and issue a credential stating the identity verification status. Only previously verified identities (based on a network of trust) with assigned privileges can verify other identities. Having a verified identity provides the opportunity for other identities to identify and verify a the entity they interact to.
 *     tags:
 *     - verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VerifyIdentityBodySchema"
 *           example:
 *             subject:
 *               identityId: did:iota:3yKgJoNyH9BEZ5Sh1YuHXAJeNARVqvEJLN87kd2ctm4h
 *               credentialType: VerifiableCredential
 *               claim:
 *                 type: Service
 *             initiatorVC:
 *               '@context': https://www.w3.org/2018/credentials/v1
 *               id: did:iota:CtPnfQqSZBmZEe5A5iNZzJ6pkCqUxtsFsErNfA3CeHpY
 *               type:
 *               - VerifiableCredential
 *               - VerifiedIdentityCredential
 *               credentialSubject:
 *                 id: did:iota:CtPnfQqSZBmZEe5A5iNZzJ6pkCqUxtsFsErNfA3CeHpY
 *                 type: Person
 *                 initiatorId: did:iota:AUKN9UkJrTGGBcTZiYC3Yg2FLPQWnA11X8z6D6DDn56Y
 *               issuer: did:iota:94T4RpgfSsGbsH9v5BFPAps4zcyNDBXocP4CBfN4nWof
 *               issuanceDate: 2021-06-18T11:33:59Z
 *               proof:
 *                 type: MerkleKeySignature2021
 *                 verificationMethod: #key-collection-0
 *                 signatureValue: 8VZJmBRcjjsmzoLGcdap5MWBqgKVf27Gbvubatk2ibxU.1112Pe57T4J3dzcCs5V2X2ffM8Xex521NkscDDoa8cshh7sSM.596PBh54fsBnHj9P5Fgw3mSJrChFNHDifb2mf4oK6kMBL8PU52c5f5oMHCrV3CudZ9PoexjRfrjL6TjAM22vkyYv
 *     responses:
 *       200:
 *         description: The created credential.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VerifiableCredentialSchema"
 *       401:
 *         description: No valid api key provided / Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 *       5XX:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
verificationRouter.post(
	'/create-credential',
	apiKeyMiddleware,
	authMiddleWare,
	validate({ body: VerifyIdentityBodySchema }),
	createVerifiableCredential
);

/**
 * @openapi
 * /verification/check-credential:
 *   post:
 *     summary: Check the verifiable credential of an identity
 *     description: Check the verifiable credential of an identity. Validates the signed verifiable credential against the Issuer information stored onto the IOTA Tangle and checks if the issuer identity (DID) contained in the credential is from a trusted root.
 *     tags:
 *     - verification
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VerifiableCredentialSchema"
 *           example:
 *             '@context': https://www.w3.org/2018/credentials/v1
 *             id: did:iota:CtPnfQqSZBmZEe5A5iNZzJ6pkCqUxtsFsErNfA3CeHpY
 *             type:
 *             - VerifiableCredential
 *             - VerifiedIdentityCredential
 *             credentialSubject:
 *               id: did:iota:CtPnfQqSZBmZEe5A5iNZzJ6pkCqUxtsFsErNfA3CeHpY
 *               type: Person
 *               initiatorId: did:iota:AUKN9UkJrTGGBcTZiYC3Yg2FLPQWnA11X8z6D6DDn56Y
 *             issuer: did:iota:94T4RpgfSsGbsH9v5BFPAps4zcyNDBXocP4CBfN4nWof
 *             issuanceDate: 2021-06-18T11:33:59Z
 *             proof:
 *               type: MerkleKeySignature2021
 *               verificationMethod: #key-collection-0
 *               signatureValue: 8VZJmBRcjjsmzoLGcdap5MWBqgKVf27Gbvubatk2ibxU.1112Pe57T4J3dzcCs5V2X2ffM8Xex521NkscDDoa8cshh7sSM.596PBh54fsBnHj9P5Fgw3mSJrChFNHDifb2mf4oK6kMBL8PU52c5f5oMHCrV3CudZ9PoexjRfrjL6TjAM22vkyYv
 *     responses:
 *       200:
 *         description: The registered entity.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isVerified:
 *                   type: boolean
 *       401:
 *         description: No valid api key provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 *       5XX:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
verificationRouter.post('/check-credential', apiKeyMiddleware, validate({ body: VerifiableCredentialBodySchema }), checkVerifiableCredential);

/**
 * @openapi
 * /verification/revoke-credential:
 *   post:
 *     summary: Revoke one specific verifiable credential of an identity
 *     description: Revoke one specific verifiable credential of an identity. In the case of individual and organization identities the reason could be that the user has left the organization. Only organization admins (with verified identities) or the identity owner itself can do that.
 *     tags:
 *     - verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RevokeVerificationBodySchema"
 *           example:
 *             signatureValue: 8VZJmBRcjjsmzoLGcdap5MWBqgKVf27Gbvubatk2ibxU.1112Pe57T4J3dzcCs5V2X2ffM8Xex521NkscDDoa8cshh7sSM.596PBh54fsBnHj9P5Fgw3mSJrChFNHDifb2mf4oK6kMBL8PU52c5f5oMHCrV3CudZ9PoexjRfrjL6TjAM22vkyYv
 *     responses:
 *       200:
 *         description: Revoke successful
 *       401:
 *         description: No valid api key provided / Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 *       5XX:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
verificationRouter.post(
	'/revoke-credential',
	apiKeyMiddleware,
	authMiddleWare,
	validate({ body: RevokeVerificationBodySchema }),
	revokeVerifiableCredential
);
