import { Router, type IRouter } from "express";
import healthRouter from "./health";
import listingsRouter from "./listings";
import blogRouter from "./blog";
import agentsRouter from "./agents";
import inquiriesRouter from "./inquiries";
import servicesRouter from "./services";
import seoRouter from "./seo";
import storageRouter from "./storage";
import adminAuthRouter from "./admin/auth";
import adminListingsRouter from "./admin/listings";
import adminBlogRouter from "./admin/blog";
import adminInquiriesRouter from "./admin/inquiries";
import adminAgentsRouter from "./admin/agents";
import adminServicesRouter from "./admin/services";
import adminSettingsRouter from "./admin/settings";
import heroSlidesRouter from "./heroSlides";
import adminHeroSlidesRouter from "./admin/heroSlides";

const router: IRouter = Router();

// Public routes
router.use(healthRouter);
router.use("/listings", listingsRouter);
router.use("/blog", blogRouter);
router.use("/agents", agentsRouter);
router.use("/inquiries", inquiriesRouter);
router.use("/services", servicesRouter);

// SEO routes (sitemap + robots at /api/sitemap.xml and /api/robots.txt)
router.use(seoRouter);

// Storage routes (presigned uploads + object serving)
router.use(storageRouter);

// Admin routes
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/listings", adminListingsRouter);
router.use("/admin/blog", adminBlogRouter);
router.use("/admin/inquiries", adminInquiriesRouter);
router.use("/admin/agents", adminAgentsRouter);
router.use("/admin/services", adminServicesRouter);
router.use("/admin/settings", adminSettingsRouter);
router.use("/hero-slides", heroSlidesRouter);
router.use("/admin/hero-slides", adminHeroSlidesRouter);

export default router;
