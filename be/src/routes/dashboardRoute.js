import express from 'express';

import { } from '../controllers';

const router = express.Router();

let homeRoute = (app) => {
    router.get("/", (req, res) => {

        return res.json({

        });

    });

    router.get("/about", (req, res) => {
        return res.json({

        });
    });


    return app.use("/", router);
}

module.exports = router;