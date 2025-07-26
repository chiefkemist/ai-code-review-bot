#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read --allow-write --allow-run

import { run } from "probot";
import app from "./index.ts";

run(app);