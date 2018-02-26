import { fromPromise } from 'rxjs/observable/fromPromise'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { takeUntil, switchMap, tap } from 'rxjs/operators'

const rand = () => Math.floor(Math.random() * 100)

const getData = function() {
  return new Promise((resolve, reject) => {
    const data = rand()
    setTimeout(() => resolve(data), 2000)
  })
}

const $show = document.querySelector('#show')

// 定义开始点击
const startClick$ = fromEvent(document.querySelector('#start'), 'click')
// 定义结束点击
const endClick$ = fromEvent(document.querySelector('#end'), 'click')

// 定义请求流
const createRequest = () => 
  fromPromise(getData())
    .pipe(
      tap(() => console.log('创建了一个请求')),
      takeUntil(endClick$), 
    )

// 定义显示流
// 单击开始按钮开始，多次点击只响应最近一次（swichMap）
// 单击结束按钮停止请求
const show$ = startClick$
  .pipe(
    switchMap(createRequest)
  )

const setShowContent = content => $show.textContent = content

startClick$.subscribe(e => setShowContent('正在查询...'))
show$.subscribe(setShowContent)
endClick$.subscribe(e => setShowContent('停止查询'))