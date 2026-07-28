import { Router, type IRouter } from "express";
import healthRouter from "./health";
import listingsRouter from "./listings";
import blogRouter from "./blog";
import agentsRouter from "./agents";
import inquiriesRouter from "./inquiries";
import seoRouter from "./seo";
import adminAuthRouter from "./admin/auth";
import adminListingsRouter from "./admin/listings";
import adminBlogRouter from "./admin/blog";
import adminInquiriesRouter from "./admin/inquiries";

const router: IRouter = Router();

// Public routes
router.use(healthRouter);
router.use("/listings", listingsRouter);
router.use("/blog", blogRouter);
router.use("/agents", agentsRouter);
router.use("/inquiries", inquiriesRouter);

// SEO routes (sitemap + robots at /api/sitemap.xml and /api/robots.txt)
router.use(seoRouter);

// Admin routes
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/listings", adminListingsRouter);
router.use("/admin/blog", adminBlogRouter);
router.use("/admin/inquiries", adminInquiriesRouter);

export default router;
