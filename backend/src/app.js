import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes.js";
import morgan from "morgan";
import * as uuid from "uuid";
import swaggerUi from "swagger-ui-express";
import { handleError } from "./models/error.models.js";
import dotenv from "dotenv";

import document from "../docs/swagger-ui.json" with { type: "json" };
dotenv.config();

const app = express();

morgan.token("id", (req, res) => req.id || "-");

const assignId = (req, res, next) => {
    // generate 16-byte UUID
    if (!req.id) {
        req.id = uuid.v4().slice(0, 32);
    }
    res.setHeader("X-Request-Id", req.id);
    next();
};

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for Swagger UI to work
}));
app.use(cors());
if (process.env.NODE_ENV === "development") {
    app.use(assignId);
    app.use(
        morgan(
            ":id :method :url :status :response-time ms - :res[content-length] - :res[content-type] - " +
                ":req[user-agent] - :req[accept] - :req[host] - :req[origin] - :req[referer] - :req[content-length] - " +
                ":req[content-type]"
        )
    );
}
// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(document, {
        explorer: true,
        customSiteTitle: "Jamu Kita API Documentation",
        customCss: ".swagger-ui .topbar { display: none }",
    })
);
app.use("/v1", routes);
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Jamu Kita API",
        version: "1.0.0",
        baseURL: "/v1",
    });
});

app.use(handleError);

export default app;
