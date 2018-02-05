<template>
  <div class="nav-breadcrumb-wrap">
        <div class="container">
            <nav class="nav-breadcrumb">
            <a href="/">Home</a>
            <slot name="bread"></slot>
            <!--使用插槽语法，复杂嵌套  -->
            </nav>
        </div>
    </div>
</template>
