module.exports = {
    root: true,
    modules: {
        "bem-tools": {
            plugins: {
                create: {
                techs: ["pug", "scss", "styl", "js"],
                    levels: {
                        "src/blocks/modules": {
                            default: true
                        }
                    }
                }
            }
        }
    }
};