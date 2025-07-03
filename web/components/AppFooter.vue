<template>
  <HenaketViewport
    class="py-10 px-16 bg-text-200 border-t border-gray-100 z-10"
    col
    parentElement="footer"
  >
    <div class="w-full flex flex-col lg:flex-row justify-between items-center">
      <section
        class="md:flex md:flex-col md:gap-5 flex flex-col gap-6 items-start md:items-start"
      >
        <div class="flex items-center text-text-800">
          <div class="flex">
            <h3 class="text-[#454545] text-base font-normal leading-normal">
              <a class="text-[#454545]" href="#">Անձնական տվյալների մշակում</a>
              <p class="mb-2 md:hidden" />
              <a
                class="text-[#454545] ml-4 text-base font-normal leading-normal"
                href="#"
              >
                Մատչելիության հայտարարություն
              </a>
            </h3>
          </div>
        </div>

        <div class="text-[#1a1a1a] text-base font-normal flex leading-normal">
          {{ copyrightText }}
        </div>
      </section>

      <div
        class="md:flex md:justify-center lg:justify-start md:items-center hidden"
      >
        <img
          alt="Հայաստանի Հանրապետության զինանշան"
          class="max-w-32 h-[90px]"
          loading="lazy"
          src="/Logo-dark.svg"
        />
      </div>
    </div>
  </HenaketViewport>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { templateInterpolation } from "~/utils/interpolation";

const copyrightText = computed(() => {
  const year = new Date().getFullYear();
  const text =
    "© {year} Հայաստանի Հանրապետություն Ներքին գործերի նախարարություն";
  return templateInterpolation(text, { year });
});
</script>
