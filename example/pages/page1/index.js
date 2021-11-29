import {
  connect,
  useState,
  useDispatch,
  useRef,
  useSelector,
} from '../../lib/redux-miniprogram-bindings'
import { setCount } from '../../store/actions/counter'
import { setUserInfo } from '../../store/actions/userInfo'

const introSelector = useSelector(
  (state) => {
    console.log('Re-calculate')
    return { intro: `Name：${state.userInfo.name}，Age：${state.userInfo.age}` }
  },
  ['userInfo'],
)
const counterSelector = useSelector((state) => ({ counterText: `count数量：${state.counter}` }), [
  'counter',
])

connect({
  mapState: ['counter', introSelector, counterSelector],
  mapDispatch: (dispatch) => ({
    handleReset() {
      dispatch(setCount(0))
    },
    updateUserInfo(userInfo) {
      dispatch(setUserInfo(userInfo))
    },
  }),
})({
  data: {
    inputValue: '',
  },

  onLoad() {
    const calcUserName = (state) => {
      console.log('do calc user name')
      return state.userInfo.name
    }
    const userNameRef = useRef(useSelector(calcUserName, ['userInfo']))
    console.log('Username', userNameRef.value)

    setTimeout(() => {
      this.updateUserInfo({
        name: 'New username1',
        age: 26,
      })
      this.updateUserInfo({
        name: 'New username2',
        age: 26,
      })

      console.log('username', userNameRef.value)
    }, 3000)
  },

  handleInput(e) {
    this.setData({
      inputValue: e.detail.value,
    })
  },
  updateUserName() {
    const state = useState()
    const dispatch = useDispatch()
    dispatch(
      setUserInfo({
        ...state.userInfo,
        name: this.data.inputValue,
      }),
    )
    this.setData({
      inputValue: '',
    })
  },
})
