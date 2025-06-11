import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
  
  key: ARCJET_KEY,
  characteristics: ["ip.src"], 
  rules: [
    
    shield({ mode: "LIVE" }), // Shield protects your app from common attacks e.g. SQL injection
    detectBot({ // Create a bot detection rule
      mode: "LIVE", // Blocks requests
      allow: [ // Block all bots except the following
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
      ],
    }),
    // Create a token bucket rate limit.
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;