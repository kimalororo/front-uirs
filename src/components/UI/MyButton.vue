<template>
  <button :class="buttonClasses" class="my-button shadow">
    <span v-if="$slots.icon" class="icon">
      <slot name="icon" />
    </span>
    <span class="text"><slot /></span>
  </button>
</template>

<script>
export default {
  name: 'MyButton',
  props: {
    /**
     * variant: 'filled' | 'outline'
     */
    variant: {
      type: String,
      default: 'filled'
    },
    /**
     * color: 'primary' | 'gray' | 'danger' | 'yellow' | 'nvb' | 'dark'
     */
    color: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    buttonClasses() {
      return [
        'btn',
        `btn--${this.variant}`,
        `btn--${this.color}`
      ];
    }
  }
};
</script>

<style scoped>
/** Base button styles **/
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s;
  border: 1px solid transparent;
}

.shadow {
  box-shadow:
    0 8px 12px rgba(0, 0, 0, 0.15),
    0 3px 4px rgba(0, 0, 0, 0.1);
}
.shadow:hover {
  box-shadow:
    0 10px 14px rgba(0, 0, 0, 0.18),
    0 5px 6px rgba(0, 0, 0, 0.12);
}


.icon {
  margin-right: 14px;
  display: inline-flex;
}
.text {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  text-align: start;
}

/** Варианты заливки **/
.btn--filled {
  color: #fff;
}
.btn--outline {
  background: transparent;
}

/** Для навбарчика **/
.btn--nvb.btn--filled {
  background-color: #e7f4e8;
  border-color: black;
  color: #4F4B4B;
}
.btn--nvb.btn--filled:hover {
  background-color: #b3c5b4ef;
  border-color: white;
}
.btn--nvb.btn--outline {
  color: black;
  border-color: black;
}
.btn--nvb.btn--outline:hover {
  background-color: #d8c2cf;
}

/** Темное **/
.btn--dark.btn--filled {
  background-color: #436e50;
  border-color: #436e50;
  color: white;
}
.btn--dark.btn--filled:hover {
  background-color: #4a7758ea;
  border-color: #15261d;
}
.btn--dark.btn--outline {
  color: #436e50;
  border-color: #436e50;
}
.btn--dark.btn--outline:hover {
  background-color: #436e502b;
}

/** Primary color **/
.btn--primary.btn--filled {
  background-color: #3498db;
  border-color: #3498db;
}
.btn--primary.btn--filled:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}
.btn--primary.btn--outline {
  color: #3498db;
  border-color: #3498db;
}
.btn--primary.btn--outline:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

/** Gray **/
.btn--gray.btn--filled {
  background-color: #7f8c8d;
  border-color: #7f8c8d;
  color: #fff;
}
.btn--gray.btn--filled:hover {
  background-color: #666;
  border-color: #666;
}
.btn--gray.btn--outline {
  color: #7f8c8d;
  border-color: #7f8c8d;
}
.btn--gray.btn--outline:hover {
  background-color: rgba(127, 140, 141, 0.1);
}

/** Danger **/
.btn--danger.btn--filled {
  background-color: #e74c3c;
  border-color: #e74c3c;
}
.btn--danger.btn--filled:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}
.btn--danger.btn--outline {
  color: #e74c3c;
  border-color: #e74c3c;
}
.btn--danger.btn--outline:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

/** Yellow **/
.btn--yellow.btn--filled {
  background-color: #f39c12;
  border-color: #f39c12;
}
.btn--yellow.btn--filled:hover {
  background-color: #d35400;
  border-color: #d35400;
}
.btn--yellow.btn--outline {
  color: #f39c12;
  border-color: #f39c12;
}
.btn--yellow.btn--outline:hover {
  background-color: rgba(243, 156, 18, 0.1);
}
</style>
