import express from "express";
import {
  getCampaignList,
  createCampaign,
  getCampaignById,
  getContinueCampaign,
  pauseCampaign,
  cancelCampaign,
  createDirectLinkCampaign,
  createGoogleMapReviewCampaign,
} from "../../../controllers/coreController/campaign.controller"; // Adjust path
import { authorization } from "../../../middleware/auth";


const router = express.Router();

/**
 * @swagger
 * /campaigns/search:
 *   post:
 *     summary: Get a list of campaigns with filters
 *     description: Retrieve campaigns filtered by various conditions, with pagination support.
 *     tags: [Campaigns]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: Filter by key
 *                 example: ""
 *               userId:
 *                 type: integer
 *                 description: Filter by user ID
 *                 example: 1
 *               countryId:
 *                 type: integer
 *                 description: Filter by country ID
 *                 example: 1
 *               campaignTypeId:
 *                 type: string
 *                 description: Filter by campaign type
 *                 example: "1"
 *               device:
 *                 type: string
 *                 description: Filter by device
 *                 example: "Mobile"
 *               title:
 *                 type: string
 *                 description: Filter by time code
 *                 example: "UTC"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Filter by start date (gte)
 *                 example: "2025-04-10T00:00:00"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Filter by end date (lte)
 *                 example: "2025-04-20T23:59:59"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, PENDING]
 *                 description: Filter by campaign status
 *                 example: "ACTIVE"
 *               page:
 *                 type: integer
 *                 description: Page number for pagination (default is 0, which skips pagination)
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: Number of campaigns per page (default is 0, which skips pagination)
 *                 example: 10
 *     responses:
 *       200:
 *         description: Campaigns retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Campaigns retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     campaigns:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           userId:
 *                             type: integer
 *                             example: 1
 *                           countryId:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Summer Sale"
 *                           type:
 *                             type: string
 *                             example: "1"
 *                           campaignTypeId:
 *                             type: integer
 *                             example: 1
 *                           device:
 *                             type: string
 *                             example: "Mobile"
 *                           title:
 *                             type: string
 *                             example: "UTC"
 *                           startDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-10T00:00:00"
 *                           endDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-20T23:59:59"
 *                           domain:
 *                             type: string
 *                             example: "example.com"
 *                           search:
 *                             type: string
 *                             example: "Google"
 *                           status:
 *                             type: string
 *                             example: "ACTIVE"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-09T07:00:00"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-09T07:00:00"
 *                     total:
 *                       type: integer
 *                       example: 100
 *       400:
 *         description: Bad request - Invalid filter parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid startDate format
 *                 error:
 *                   type: string
 *                   example: Invalid field
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error fetching campaigns
 *                 error:
 *                   type: string
 *                   example: Database error
 */
router.post("/search", authorization(["search-campaigns"]), getCampaignList);

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create a new campaign
 *     description: Create a new campaign with required fields, optional keywords, and links.
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - countryId
 *               - name
 *               - type
 *               - device
 *               - title
 *               - startDate
 *               - end PaiDate
 *               - domain
 *               - search
 *               - campaignTypeId
 *               - status
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *                 example: 1
 *               countryId:
 *                 type: integer
 *                 description: ID of the country
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Name of the campaign
 *                 example: "Summer Sale"
 *               device:
 *                 type: string
 *                 description: Device target
 *                 example: "Mobile"
 *               title:
 *                 type: string
 *                 description: Time zone code
 *                 example: "UTC"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the campaign
 *                 example: "2025-04-10T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the campaign
 *                 example: "2025-04-20T23:59:59Z"
 *               domain:
 *                 type: string
 *                 description: Target domain
 *                 example: "example.com"
 *               search:
 *                 type: string
 *                 description: Search engine
 *                 example: "Google"
 *               campaignTypeId:
 *                 type: integer
 *                 description: ID of the campaign type
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, COMPLETED, PENDING]
 *                 description: Status of the campaign
 *                 example: "ACTIVE"
 *               keywords:
 *                 type: array
 *                 description: Optional array of keywords
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - urls
 *                     - distribution
 *                     - keywordType
 *                     - traffic
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Keyword name
 *                       example: "summer sale"
 *                     videoTitle:
 *                       type: string
 *                       description: Video title for the keyword
 *                       example: "Summer Sale"
 *                     urls:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of URLs for the keyword
 *                       example: ["https://example.com/page1", "https://example.com/page2"]
 *                     distribution:
 *                       type: string
 *                       enum: [DAY, MONTH, YEAR]
 *                       description: Distribution type for the keyword
 *                       example: "DAY"
 *                     traffic:
 *                       type: integer
 *                       description: Traffic for the keyword (optional)
 *                       example: 100
 *                     timeOnSite:
 *                       type: integer
 *                       description: Time on site for the keyword (optional)
 *                       example: 1
 *                     keywordType:
 *                       type: string
 *                       enum: [ORGANIC, VIDEO]
 *                       description: Type of keyword
 *                       example: "ORGANIC"
 *               links:
 *                 type: array
 *                 description: Optional array of links
 *                 items:
 *                   type: object
 *                   required:
 *                     - link
 *                   properties:
 *                     link:
 *                       type: string
 *                       description: Link URL
 *                       example: "https://example.com/link"
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Campaign created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     countryId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Summer Sale"
 *                     campaignTypeId:
 *                       type: integer
 *                       example: 1
 *                     device:
 *                       type: string
 *                       example: "Mobile"
 *                     title:
 *                       type: string
 *                       example: "UTC"
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-10T00:00:00Z"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-20T23:59:59Z"
 *                     totalTraffic:
 *                       type: integer
 *                       example: 1000
 *                     cost:
 *                       type: number
 *                       example: 500.00
 *                     domain:
 *                       type: string
 *                       example: "example.com"
 *                     search:
 *                       type: string
 *                       example: "Google"
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     keywords:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           campaignId:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "summer sale"
 *                           videoTitle:
 *                             type: string
 *                             example: "Summer Sale"
 *                           urls:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["https://example.com/page1", "https://example.com/page2"]
 *                           distribution:
 *                             type: string
 *                             example: "DAY"
 *                           traffic:
 *                             type: integer
 *                             example: 100
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                     links:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           campaignId:
 *                             type: integer
 *                             example: 1
 *                           link:
 *                             type: string
 *                             example: "https://example.com/link"
 *                           linkTo:
 *                             type: string
 *                             example: "https://example.com/target"
 *                           distribution:
 *                             type: string
 *                             example: "DAY"
 *                           traffic:
 *                             type: integer
 *                             example: 50
 *                           anchorText:
 *                             type: string
 *                             example: "Click here"
 *                           status:
 *                             type: string
 *                             example: "ACTIVE"
 *                           url:
 *                             type: string
 *                             example: "https://example.com"
 *                           page:
 *                             type: string
 *                             example: "/page1"
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-09T07:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-09T07:00:00Z"
 *       400:
 *         description: Bad request - Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "All required fields must be provided"
 *                 error:
 *                   type: string
 *                   example: "Missing or invalid field"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error creating campaign"
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */
router.post("/", authorization(["create-campaign"]), createCampaign);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     description: Retrieve a specific campaign by its ID.
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Campaign retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     countryId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Summer Sale"
 *                     device:
 *                       type: string
 *                       example: "Mobile"
 *                     title:
 *                       type: string
 *                       example: "UTC "
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-10T00:00:00
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-20T23:59:59
 *                     totalTraffic:
 *                       type: integer
 *                       example: 0
 *                     cost:
 *                       type: number
 *                       example: 500.00
 *                     domain:
 *                       type: string
 *                       example: "example.com"
 *                     search:
 *                       type: string
 *                       example: "Google"
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-09T07:00:00
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-09T07:00:00
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Campaign not found
 *                 error:
 *                   type: string
 *                   example: Resource not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error fetching campaign
 *                 error:
 *                   type: string
 *                   example: Database error
 */
router.get("/:id", authorization(["read-campaign"]), getCampaignById);
/**
 * @swagger
 * /campaigns/pause/{id}:
 *   put:
 *     summary: Pause a campaign by ID
 *     description: Pauses a campaign by setting its status to PAUSED, updating the endDate to the current time, and setting all associated keywords and links to INACTIVE.
 *     tags:
 *       - Campaigns
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the campaign to stop
 *     responses:
 *       200:
 *         description: Campaign stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the campaign
 *                 title:
 *                   type: string
 *                   description: The title of the campaign
 *                 name:
 *                   type: string
 *                   description: The name of the campaign
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: The start date of the campaign
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   description: The end date of the campaign (set to current time)
 *                 domain:
 *                   type: string
 *                   description: The domain associated with the campaign
 *                 status:
 *                   type: string
 *                   enum: [PAUSED]
 *                   description: The status of the campaign (PAUSED)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the campaign
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the campaign
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [INACTIVE]
 *                   description: List of associated links (all set to INACTIVE)
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       keyword:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [INACTIVE]
 *                   description: List of associated keywords (all set to INACTIVE)
 *       400:
 *         description: Bad request due to invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: ValidationError
 *                 message:
 *                   type: string
 *                   example: Invalid campaign ID
 *                 code:
 *                   type: integer
 *                   example: 400
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: NotFoundError
 *                 message:
 *                   type: string
 *                   example: Campaign with id 123 not found
 *                 code:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: UnknownError
 *                 message:
 *                   type: string
 *                   example: Failed to stop campaign
 *                 code:
 *                   type: integer
 *                   example: 500
 */
router.put("/pause/:id", authorization(["read-campaign"]), pauseCampaign);
/**
 * @swagger
 * /campaigns/continue/{id}:
 *   put:
 *     summary: continue a campaign by ID
 *     description: continue a campaign by setting its status to ACTIVE
 *     tags:
 *       - Campaigns
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the campaign to continue
 *     responses:
 *       200:
 *         description: Campaign continue successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the campaign
 *                 title:
 *                   type: string
 *                   description: The title of the campaign
 *                 name:
 *                   type: string
 *                   description: The name of the campaign
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: The start date of the campaign
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   description: The end date of the campaign (set to current time)
 *                 domain:
 *                   type: string
 *                   description: The domain associated with the campaign
 *                 status:
 *                   type: string
 *                   enum: [ACTIVE]
 *                   description: The status of the campaign (ACTIVE)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the campaign
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the campaign
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [ACTIVE]
 *                   description: List of associated links (all set to ACTIVE)
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       keyword:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [ACTIVE]
 *                   description: List of associated keywords (all set to ACTIVE)
 *       400:
 *         description: Bad request due to invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: ValidationError
 *                 message:
 *                   type: string
 *                   example: Invalid campaign ID
 *                 code:
 *                   type: integer
 *                   example: 400
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: NotFoundError
 *                 message:
 *                   type: string
 *                   example: Campaign with id 123 not found
 *                 code:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: UnknownError
 *                 message:
 *                   type: string
 *                   example: Failed to continue campaign
 *                 code:
 *                   type: integer
 *                   example: 500
 */
router.put("/continue/:id", authorization(["read-campaign"]), getContinueCampaign);
/**
 * @swagger
 * /campaigns/cancel/{id}:
 *   put:
 *     summary: Stop a campaign by ID
 *     description: Pauses a campaign by setting its status to PAUSED, updating the endDate to the current time, and setting all associated keywords and links to INACTIVE.
 *     tags:
 *       - Campaigns
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the campaign to stop
 *     responses:
 *       200:
 *         description: Campaign stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the campaign
 *                 title:
 *                   type: string
 *                   description: The title of the campaign
 *                 name:
 *                   type: string
 *                   description: The name of the campaign
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: The start date of the campaign
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   description: The end date of the campaign (set to current time)
 *                 domain:
 *                   type: string
 *                   description: The domain associated with the campaign
 *                 status:
 *                   type: string
 *                   enum: [COMPLETED]
 *                   description: The status of the campaign (COMPLETED)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the campaign
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the campaign
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [INACTIVE]
 *                   description: List of associated links (all set to INACTIVE)
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       keyword:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [INACTIVE]
 *                   description: List of associated keywords (all set to INACTIVE)
 *       400:
 *         description: Bad request due to invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: ValidationError
 *                 message:
 *                   type: string
 *                   example: Invalid campaign ID
 *                 code:
 *                   type: integer
 *                   example: 400
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: NotFoundError
 *                 message:
 *                   type: string
 *                   example: Campaign with id 123 not found
 *                 code:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: UnknownError
 *                 message:
 *                   type: string
 *                   example: Failed to stop campaign
 *                 code:
 *                   type: integer
 *                   example: 500
 */
router.put("/cancel/:id", authorization(["read-campaign"]), cancelCampaign);

/**
 * @swagger
 * /campaigns/direct-links:
 *   post:
 *     summary: Create a new direct link
 *     description: Create a new direct link with required fields
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - countryId
 *               - name
 *               - device
 *               - title
 *               - startDate
 *               - endDate
 *               - domain
 *               - search
 *               - campaignTypeId
 *               - status
 *               - directLinks
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user
 *                 example: 1
 *               countryId:
 *                 type: integer
 *                 description: The ID of the country
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: The name of the campaign
 *                 example: "Summer Sale"
 *               campaignTypeId:
 *                 type: integer
 *                 description: The ID of the campaign TYPE, type 4 (DIRECT_LINK) or type 6 (DIRECT_LINK_VIDEO_COST)
 *                 example: 4
 *               device:
 *                 type: string
 *                 description: The device of the campaign
 *                 example: "Mobile"
 *               title:
 *                 type: string
 *                 description: The title of the campaign
 *                 example: "UTC"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the campaign
 *                 example: "2025-04-10T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the campaign
 *                 example: "2025-04-20T23:59:59Z"
 *               domain:
 *                 type: string
 *                 description: The domain of the campaign
 *                 example: "example.com"
 *               search:
 *                 type: string
 *                 description: The search of the campaign
 *                 example: "Google"
 *               status:
 *                 type: string
 *                 description: The status of the campaign
 *                 example: "ACTIVE"
 *               directLinks:
 *                 type: array
 *                 description: The direct links of the campaign
 *                 items:
 *                   type: object
 *                   properties:
 *                     link:
 *                       type: string
 *                       description: The link of the direct link
 *                       example: "https://example.com"
 *                     type:
 *                       type: string
 *                       description: The type of the direct link
 *                       example: "ORGANIC"
 *                     distribution:
 *                       type: string
 *                       description: The distribution of the direct link
 *                       example: "DAY"
 *                     timeOnSite:
 *                       type: integer
 *                       description: The time on site of the direct link
 *                     traffic:
 *                       type: integer
 *                       description: The traffic of the direct link
 *     responses:
 *       201:
 *         description: Direct link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Direct link created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     countryId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Summer Sale"
 *                     campaignTypeId:
 *                       type: integer
 *                       example: 4
 *                     device:
 *                       type: string
 *                       example: "Mobile"
 *                     title:
 *                       type: string
 *                       example: "UTC"
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-10T00:00:00Z"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-20T23:59:59Z"
 *                     domain:
 *                       type: string
 *                       example: "example.com"
 *                     search:
 *                       type: string
 *                       example: "Google"
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     directLinks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           link:
 *                             type: string
 *                           distribution:
 *                             type: string
 *                           timeOnSite:
 *                             type: integer
 *                           traffic:
 *                             type: integer
 *       400:
 *         description: Bad request due to invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/direct-links", authorization(["create-campaign"]), createDirectLinkCampaign);

/**
 * @swagger
 * /campaigns/google-maps-review:
 *   post:
 *     summary: Create a new Google Map Review campaign
 *     description: Create a new campaign for Google Map Reviews with required fields
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - countryId
 *               - name
 *               - device
 *               - title
 *               - startDate
 *               - endDate
 *               - domain
 *               - search
 *               - campaignTypeId
 *               - googleMapReviews
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user creating the campaign
 *                 example: 1
 *               countryId:
 *                 type: integer
 *                 description: ID of the country for the campaign
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Name of the campaign
 *                 example: "Google Reviews Campaign"
 *               device:
 *                 type: string
 *                 description: Device type for the campaign
 *                 example: "Mobile"
 *               title:
 *                 type: string
 *                 description: Title of the campaign
 *                 example: "UTC"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the campaign
 *                 example: "2025-04-10T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the campaign
 *                 example: "2025-04-20T23:59:59Z"
 *               domain:
 *                 type: string
 *                 description: Domain for the campaign
 *                 example: "example.com"
 *               search:
 *                 type: string
 *                 description: Search tool for the campaign
 *                 example: "Google"
 *               campaignTypeId:
 *                 type: integer
 *                 description: Type ID of the campaign (must be 7 for Google Map Review)
 *                 example: 7
 *               googleMapReviews:
 *                 type: array
 *                 description: Array of Google Map Reviews
 *                 items:
 *                   type: object
 *                   required:
 *                     - content
 *                     - location
 *                     - googleMapUrl
 *                     - stars
 *                   properties:
 *                     content:
 *                       type: string
 *                       description: Content of the review
 *                       example: "Great service and friendly staff!"
 *                     location:
 *                       type: string
 *                       description: Location of the review
 *                       example: "123 Main St, City"
 *                     googleMapUrl:
 *                       type: string
 *                       description: URL of the Google Map location
 *                       example: "https://maps.google.com/..."
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of image URLs for the review
 *                       example: ["https://example.com/image1.jpg"]
 *                     stars:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 5
 *                       description: Rating stars (1-5)
 *                       example: 5
 *     responses:
 *       201:
 *         description: Google Map Review Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Google Map Review Campaign created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     countryId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Google Reviews Campaign"
 *                     campaignTypeId:
 *                       type: integer
 *                       example: 7
 *                     device:
 *                       type: string
 *                       example: "Mobile"
 *                     title:
 *                       type: string
 *                       example: "UTC"
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-10T00:00:00Z"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-20T23:59:59Z"
 *                     totalReviews:
 *                       type: integer
 *                       example: 10
 *                     totalCost:
 *                       type: number
 *                       example: 500.00
 *                     domain:
 *                       type: string
 *                       example: "example.com"
 *                     search:
 *                       type: string
 *                       example: "Google"
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     googleMapReviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           content:
 *                             type: string
 *                             example: "Great service!"
 *                           location:
 *                             type: string
 *                             example: "123 Main St"
 *                           googleMapUrl:
 *                             type: string
 *                             example: "https://maps.google.com/..."
 *                           imgUrls:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["https://example.com/image1.jpg"]
 *                           stars:
 *                             type: integer
 *                             example: 5
 *                           status:
 *                             type: string
 *                             example: "ACTIVE"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid campaign type"
 *                 error:
 *                   type: string
 *                   example: "Invalid field"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error creating Google Map Review campaign"
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */
router.post("/google-maps-review", authorization(["create-campaign"]), createGoogleMapReviewCampaign);

export default router;
