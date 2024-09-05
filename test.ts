import { assertEquals } from "@std/assert";
import { tag } from "https://pax.deno.dev/kawarimidoll/deno-markup-tag";

Deno.test("[health-check] import module", () => {
  assertEquals(tag("div", "ok"), "<div>ok</div>");
});
