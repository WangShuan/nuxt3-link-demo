export const vInterpolate = {
  mounted(el) {
    // 遍歷所有 a 標籤
    const links = Array.from(el.getElementsByTagName('a')).filter(item => {
      // 取出 href 屬性
      const href = item.getAttribute('href')
      // 判斷 href 是否不存在，回傳 false 不處理
      if (!href) return false
      // 判斷 href 如果開頭為 / 或與當前網頁同網域，回傳 true 改造
      return href.startsWith('/') || isSameDomainUrl(href)
    })

    // 自定義 addListeners 事件，傳入所有需要被改造的連結
    addListeners(links)

    // 自定義 $componentUpdated 隱藏事件，用來 clean up
    el.$componentUpdated = () => {
      removeListeners(links)
      nextTick(() => addListeners(links))
    }

    // 自定義 $destroy 隱藏事件，用來銷毀
    el.$destroy = () => removeListeners(links)
  },
  updated: (el) => el.$componentUpdated?.(),
  beforeUnmount: (el) => el.$destroy?.()
}

// 自定義 navigate 事件，將 a 連結點擊事件改為 navigateTo
function navigate(event) {
  const target = event.target
  const href = target.getAttribute('href')
  event.preventDefault() // 取消預設的 a 連結點擊事件
  return navigateTo(href) // 回傳調用 navigateTo
}

function addListeners(links) {
  // 遍歷所有需要被改造的連結
  links.forEach((link) => {
    // 監聽點擊事件，傳入自定義的 navigate 事件
    link.addEventListener('click', navigate, false)
  })
}

function removeListeners(links) {
  // 遍歷所有需要被改造的連結
  links.forEach((link) => {
    // 取消監聽點擊事件，傳入自定義的 navigate 事件
    link.removeEventListener('click', navigate, false)
  })
}

// 判斷傳入的連結是否與當前網站在同一個網域
function isSameDomainUrl(url) {
  var urlObject = new URL(url);
  var linkDomain = urlObject.hostname;
  var currentDomain = window.location.hostname;
  return currentDomain === linkDomain;
}