"use strict";

import gulp from "gulp";
const smartgrid = require("smart-grid");

gulp.task("smart-grid", (cb) => {
    smartgrid("./src/styles/vendor/import/", {
        outputStyle: "styl",
        filename: "smart-grid",
        columns: 12, // number of grid columns
        offset: "1.875rem", // gutter width - 30px
        mobileFirst: true,
        mixinNames: {
            container: "container"
        },
        container: {
            fields: "0.9375rem" // side fields - 15px
        },
        breakPoints: {
            xs: {
                width: "20rem" // 320px
            },
            sm: {
                width: "23.4375rem" // 375px
            },
            md: {
                width: "36rem" // 576px
            },
            mdd: {
                width: "48rem" // 768px
            },
            lg: {
                width: "64rem" // 1024px
            },
            xl: {
                width: "75rem" // 1200px
            },
            xxl: {
                width: "100rem" // 1600px
            },
            xxl2: {
                width: "120rem" // 1600px
            }
        }
    });
    cb();
});
