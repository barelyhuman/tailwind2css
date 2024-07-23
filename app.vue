<template>
  <div>
    <textarea autofocus placeholder="Tailwind classes" v-model="inputValue"></textarea>
    <textarea readonly placeholder="Output css" v-model="outputValue"></textarea>
  </div>
</template>
<script setup>
const inputValue = ref("")
const debouncedValue = ref("")
const outputValue = ref("")

function debounce(fn, delay) {
  let id;
  return (...args) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
const setDebounced = debounce((value) => {
  debouncedValue.value = value
}, 350)

watch(inputValue, () => {
  setDebounced(inputValue.value)
})

watchEffect(() => {
  $fetch("/api/transformed", {
    method: "post",
    body: JSON.stringify(debouncedValue.value)
  }).then(d => {
    outputValue.value = d
  })
})
</script>
<style scoped>
div {
  margin: 1rem;
  background: white;
  border-radius: 0.25rem;
  padding: 1rem;
  display: flex;
  min-height: calc(100vh - 2rem);
}
</style>
<style global>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-size: 100%;
  background: #efefef;
}

#app {
  display: flex;
  align-items: flex-start;
  justify-items: flex-start;
}

textarea {
  flex: 1;
  outline: none;
  border: 0px;
  background-color: transparent;
  font-size: 1rem;
  resize: none;
  padding: 1rem;
}
</style>
