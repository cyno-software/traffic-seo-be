import express from "express";
import {
  getGoogleMapReviewList,
  createGoogleMapReview,
  getGoogleMapReviewById,
  updateGoogleMapReview,
  getGoogleMapReviewsByCampaignId,
  getGoogleMapReviewImagesById,
  searchLogsGoogleReviewController,
} from "../../../controllers/coreController/googleMapReview.controller";
import { authorization } from "../../../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /google-maps-review/{id}/images:
 *   get:
 *     summary: Get GoogleMapReview images by ID
 *     description: Retrieve all images associated with a specific GoogleMapReview identified by its ID.
 *     tags: [GoogleMapReviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: GoogleMapReview ID
 *         example: 1
 *     responses:
 *       200:
 *         description: GoogleMapReview images retrieved successfully
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
 *                   example: GoogleMapReview images retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviewId:
 *                       type: integer
 *                       description: ID of the GoogleMapReview
 *                       example: 1
 *                     images:
 *                       type: object
 *                       description: Image data returned from Python API
 *                       example: { "imageUrls": ["https://example.com/image1.jpg"], "metadata": "..." }
 *       400:
 *         description: Bad request - Invalid ID format
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
 *                   example: Invalid Google Maps Review ID
 *                 error:
 *                   type: string
 *                   example: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User doesn't have permission
 *       404:
 *         description: GoogleMapReview not found
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
 *                   example: Google Maps Review not found
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
 *                   example: Error retrieving Google Maps Review images
 *                 error:
 *                   type: string
 *                   example: Database error
 */
router.get("/:id/images", getGoogleMapReviewImagesById);


/**
 * @swagger
 * /google-maps-review/search:
 *   post:
 *     summary: Get a list of GoogleMapReviews with filters
 *     description: Retrieve GoogleMapReviews filtered by campaignId, distribution, and createdAt date range.
 *     tags: [GoogleMapReviews]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignId:
 *                 type: integer
 *                 description: Filter by campaign ID
 *                 example: 1
 *               distribution:
 *                 type: string
 *                 enum: [DAY, MONTH, YEAR]
 *                 description: Filter by distribution type
 *                 example: DAY
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Start of the createdAt date range
 *                 example: 2025-04-01T00:00:00
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: End of the createdAt date range
 *                 example: 2025-04-10T23:59:59
 *     responses:
 *       200:
 *         description: GoogleMapReviews retrieved successfully
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
 *                   example: GoogleMapReviews retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     googleMapReviews:
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
 *                           content:
 *                             type: string
 *                             example: "Great service!"
 *                           location:
 *                             type: string
 *                             example: "New York"
 *                           googleMapUrl:
 *                             type: string
 *                             example: "https://maps.google.com/..."
 *                           imgUrls:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["https://example.com/image1.jpg"]
 *                           status:
 *                             type: integer
 *                             example: 1
 *                           cost:
 *                             type: number
 *                             example: 10.99
 *                           stars:
 *                             type: integer
 *                             example: 5
 *                     total:
 *                       type: integer
 *                       example: 1
 */
router.post("/search", getGoogleMapReviewList);

/**
 * @swagger
 * /google-maps-review/getByCampaign:
 *   post:
 *     summary: Get GoogleMapReviews by campaign ID
 *     description: Retrieve all GoogleMapReviews for a specific campaign.
 *     tags: [GoogleMapReviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaignId
 *             properties:
 *               campaignId:
 *                 type: integer
 *                 description: ID of the campaign
 *                 example: 1
 *     responses:
 *       200:
 *         description: GoogleMapReviews retrieved successfully
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
 *                   example: GoogleMapReviews retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       campaignId:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: "Great service!"
 *                       location:
 *                         type: string
 *                         example: "New York"
 *                       googleMapUrl:
 *                         type: string
 *                         example: "https://maps.google.com/..."
 *                       imgUrls:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["https://example.com/image1.jpg"]
 *                       status:
 *                         type: integer
 *                         example: 1
 *                       cost:
 *                         type: number
 *                         example: 10.99
 *                       stars:
 *                         type: integer
 *                         example: 5
 */
router.post("/getByCampaign", getGoogleMapReviewsByCampaignId);

/**
 * @swagger
 * /google-maps-review:
 *   post:
 *     summary: Create a new GoogleMapReview
 *     description: Create a new GoogleMapReview with required fields.
 *     tags: [GoogleMapReviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaignId
 *               - content
 *               - location
 *               - googleMapUrl
 *               - imgUrls
 *               - status
 *               - cost
 *               - stars
 *             properties:
 *               campaignId:
 *                 type: integer
 *                 description: ID of the campaign
 *                 example: 1
 *               content:
 *                 type: string
 *                 description: Review content
 *                 example: "Great service!"
 *               location:
 *                 type: string
 *                 description: Location of the review
 *                 example: "New York"
 *               googleMapUrl:
 *                 type: string
 *                 description: Google Maps URL
 *                 example: "https://maps.google.com/..."
 *               imgUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs
 *                 example: ["https://example.com/image1.jpg"]
 *               status:
 *                 type: integer
 *                 description: Review status
 *                 example: 1
 *               cost:
 *                 type: number
 *                 description: Cost of the review
 *                 example: 10.99
 *               stars:
 *                 type: integer
 *                 description: Number of stars
 *                 example: 5
 *     responses:
 *       201:
 *         description: GoogleMapReview created successfully
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
 *                   example: GoogleMapReview created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     campaignId:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: "Great service!"
 *                     location:
 *                       type: string
 *                       example: "New York"
 *                     googleMapUrl:
 *                       type: string
 *                       example: "https://maps.google.com/..."
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg"]
 *                     status:
 *                       type: integer
 *                       example: 1
 *                     cost:
 *                       type: number
 *                       example: 10.99
 *                     stars:
 *                       type: integer
 *                       example: 5
 */
router.post("/", createGoogleMapReview);

/**
 * @swagger
 * /google-maps-review/{id}:
 *   get:
 *     summary: Get a GoogleMapReview by ID
 *     description: Retrieve a specific GoogleMapReview by its ID.
 *     tags: [GoogleMapReviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: GoogleMapReview ID
 *     responses:
 *       200:
 *         description: GoogleMapReview retrieved successfully
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
 *                   example: GoogleMapReview retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     campaignId:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: "Great service!"
 *                     location:
 *                       type: string
 *                       example: "New York"
 *                     googleMapUrl:
 *                       type: string
 *                       example: "https://maps.google.com/..."
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg"]
 *                     status:
 *                       type: integer
 *                       example: 1
 *                     cost:
 *                       type: number
 *                       example: 10.99
 *                     stars:
 *                       type: integer
 *                       example: 5
 */
router.get("/:id", getGoogleMapReviewById);


/**
 * @swagger
 * /google-maps-review/{id}:
 *   patch:
 *     summary: Update a GoogleMapReview by ID
 *     description: Updates specific fields of an existing GoogleMapReview identified by its ID.
 *     tags: [GoogleMapReviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the GoogleMapReview to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Review content
 *               location:
 *                 type: string
 *                 description: Location of the review
 *               googleMapUrl:
 *                 type: string
 *                 description: Google Maps URL
 *               imgUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs
 *               status:
 *                 type: integer
 *                 description: Review status
 *               cost:
 *                 type: number
 *                 description: Cost of the review
 *               stars:
 *                 type: integer
 *                 description: Number of stars
 *             example:
 *               content: "Updated review content"
 *               location: "Los Angeles"
 *               status: 2
 *               stars: 4
 *     responses:
 *       200:
 *         description: GoogleMapReview updated successfully
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
 *                   example: GoogleMapReview updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     campaignId:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: "Updated review content"
 *                     location:
 *                       type: string
 *                       example: "Los Angeles"
 *                     googleMapUrl:
 *                       type: string
 *                       example: "https://maps.google.com/..."
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg"]
 *                     status:
 *                       type: integer
 *                       example: 2
 *                     cost:
 *                       type: number
 *                       example: 10.99
 *                     stars:
 *                       type: integer
 *                       example: 4
 */
router.patch("/:id", updateGoogleMapReview);

/**
 * @swagger
 * /google-maps-review/search-log:
 *   post:
 *     description: Retrieve logs for a specific GoogleMapReview.
 *     tags: [GoogleMapReviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleMapsReviewId:
 *                 type: integer
 *                 description: ID of the GoogleMapReview
 *                 example: 1
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
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
 *                   example: Logs retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       googleMapsReviewId:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-01T00:00:00"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-01T00:00:00"
 *                       status:
 *                         type: integer
 *                         example: 1
 *                       statusName:
 *                         type: string
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
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
 *                   example: Logs retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       googleMapsReviewId:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-01T00:00:00"
 *       400:
 *         description: Bad request - Invalid ID format
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
 *                   example: Invalid Google Maps Review ID
 *                 error:
 *                   type: string
 *                   example: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User doesn't have permission
 *       404:
 *         description: GoogleMapReview not found
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
 *                   example: Google Maps Review not found
 *                 error:
 *                   type: string
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
 *                   example: Error retrieving Google Maps Review logs
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/search-log", searchLogsGoogleReviewController);
export default router;
