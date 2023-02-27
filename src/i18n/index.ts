// 导入element-plus中英文语言包
import elementEnlocale from 'element-plus/lib/locale/lang/en'
import elementZhlocale from 'element-plus/lib/locale/lang/zh-cn'

// 导入自定义语言文件
import enLocale from './en'
import cnLocale from './cn'

/**
 * 在vue3中使用vue-i18n的方式与vue2不太一样
 * 引入的版本是next版本进行适配：yarn add vue-i18n@next
 */
import { createI18n } from 'vue-i18n'

import { getCookie } from '../utils/cookies'

const messages = {
  EN: {
    ...enLocale,
    ...elementEnlocale
  },
  CN: {
    ...cnLocale,
    ...elementZhlocale
  }
}

const i18n = createI18n({
  locale: getCookie('lang') || 'CN',  // 默认为中文
  messages
})

export default i18n