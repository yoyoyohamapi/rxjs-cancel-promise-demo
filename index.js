import { fromPromise } from 'rxjs/observable/fromPromise'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { merge } from 'rxjs/observable/merge'
import { range } from 'rxjs/observable/range'
import { ajax } from 'rxjs/observable/dom/ajax'
import { takeUntil, switchMap, mergeMap, tap, mapTo, delay } from 'rxjs/operators'
const $show = document.querySelector('#show')

// 定义开始点击
const startClick$ = fromEvent(document.querySelector('#start'), 'click')
// 定义结束点击
const endClick$ = fromEvent(document.querySelector('#end'), 'click')
const blur$ = fromEvent(window, 'blur')

// 当手动点击结束或者离开窗口，则停止请求
const endRequest$ = merge(endClick$, blur$)

const createRequest = rand => {
  return ajax(`test.png?${rand}`)
    .pipe(
      delay(500),
      takeUntil(endRequest$),
      mapTo(rand)
    )
}

// 定义显示流
// 单击开始按钮开始，模拟 1000 个图像请求
const show$ = startClick$
  .pipe(
    mergeMap(() => 
      range(0, 1000).pipe(
        mergeMap(i => createRequest(i)),
      )
    )
  )

const setShowContent = content => {
  $show.textContent = content
}

startClick$.subscribe(() => setShowContent('开始请求...'))
show$.subscribe({
  onComplete() {
    setShowContent('所有请求完毕')
  }
})
endRequest$.subscribe(() => setShowContent('结束！'))