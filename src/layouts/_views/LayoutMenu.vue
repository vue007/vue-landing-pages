<template>
  <Teleport :to="props.to" defer>
    <el-menu
      class="layout-menu"
      :mode="mode"
      :popper-offset="1"
      :defaultActive="menu.active"
      @select="handleMenuSelect"
      ellipsis
      router
    >
      <LMenuContent />
    </el-menu>
  </Teleport>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'
import { isArray } from 'es-toolkit/compat'
import type { VNode } from 'vue'

const LMenuContent = () => {
  const stack: ({ node: VNode; parentVNodeArray: any } | any)[] = []
  const result: VNode[] = []
  // 每个栈元素：{ node, parentVNodeArray }
  menuList.value.forEach((item) => stack.push({ node: item, parentVNodeArray: result }))

  while (stack.length) {
    const { node, parentVNodeArray } = stack.pop()

    if (!node) continue

    if (isArray(node.children) && node.children.length) {
      const childrenVNodes: VNode[] = []
      // 先将所有子节点入栈（逆序保证顺序一致）
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ node: node.children[i], parentVNodeArray: childrenVNodes })
      }
      parentVNodeArray.push(
        <el-sub-menu index={node.path} key={node.path}>
          {{
            title: () => <LMenuItemContent {...node} />,
            default: () => childrenVNodes,
          }}
        </el-sub-menu>,
      )
    } else {
      // 创建 el-menu-item 节点
      parentVNodeArray.push(
        <el-menu-item id={node.path} index={node.path} key={node.path}>
          <LMenuItemContent {...node} />
        </el-menu-item>,
      )
    }
  }

  return result.reverse() // 由于栈是后进先出，结果需要反转
}

const LMenuItemContent = (props) => (
  <>
    {props.meta?.icon ? (
      <el-icon>
        <svg-icon name={props.meta.icon} />
      </el-icon>
    ) : null}
    <span class='min-w-20'>{props.meta?.title}</span>
  </>
)

const { t } = useI18nLocal()
const route = useRoute()
const baseStore = useBaseStore()
const { menu, setting } = baseStore
const menuList = computed(() => menu.treeList)

const props = defineProps({
  to: { type: String, default: '#layout-aside' },
  mode: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
})

const handleMenuSelect = () => {}

watch(
  () => route.path,
  () => {
    let path = route.meta?.isTab ? route.matched[0].path : route.path
    menu.setActive(path)
    menu.setBreadcrumb(route.meta?.breadcrumb as string[])
  },
  { immediate: true },
)

onMounted(() => {})
</script>

<style lang="scss" scoped>
.layout-menu {
  border-right: unset;
  background-color: unset;
  // width: 100%;
  max-width: 500px;
  &.el-menu--horizontal {
    padding-top: 6px;
  }

  #{$size-large} {
    font-size: var(--el-font-size-large);
  }
  #{$size-small} {
    font-size: var(--el-font-size-extra-small);
  }
  :deep(.el-menu) {
    background-color: unset;
  }
}

.el-menu--horizontal {
  --el-menu-horizontal-height: 64px;

  #{$size-large} {
    --el-menu-horizontal-height: 74px;
  }
  #{$size-small} {
    --el-menu-horizontal-height: 54px;
  }
}
</style>
