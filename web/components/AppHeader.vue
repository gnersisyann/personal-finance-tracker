<template>
  <HenaketViewport
    class="py-4 w-full flex md:px-8 bg-primary relative"
    parentElement="header"
  >
    <div
      class="w-full flex justify-center xl:justify-start items-center !transform-none"
    >
      <RouterLink
        ref="headerButtonElement"
        class="flex items-center text-left bg-transparent focus:bg-transparent focus:no-underline transition-opacity duration-300"
        to="/"
      >
        <img
          alt="Հայաստանի Հանրապետության զինանշան"
          class="max-w-24 h-14"
          src="/Logo.svg"
        />

        <div class="flex self-stretch">
          <div class="w-px h-full bg-white mx-3" />
        </div>

        <div
          class="text-white text-[13px] sm:text-base font-normal sm:font-bold !leading-normal py-1 max-w-sm"
        >
          <span class="flex x font-sans">
            Հայաստանի Հանրապետության
            <br />Ներքին գործերի նախարարություն
          </span>
        </div>
      </RouterLink>

      <div class="flex-grow" />

      <div class="flex items-center shrink-0">
        <!-- <AppLanguageSwitch /> -->
      </div>
    </div>
  </HenaketViewport>
</template>
