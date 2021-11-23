let pino =  require("pino")
let G_LOGGER = pino({browser: {asObject: true}});

const LOGGER_LEVEL_DEBUG = "debug";
const LOGGER_LEVEL_PROD = "info";

function setLevel(level) {
    G_LOGGER.level = level;
}

function getLevel() {
    return G_LOGGER.level;
}

export {
    G_LOGGER,
    setLevel,
    getLevel,
    LOGGER_LEVEL_DEBUG,
    LOGGER_LEVEL_PROD
}
