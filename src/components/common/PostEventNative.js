import { useEffect } from 'react'
import { Subject } from 'rxjs'
import { useSelector } from 'react-redux'

import toUpper from 'lodash/toUpper'
// import { messageInfo } from './log/Message'


const postNativeInfo = new Subject()

const initialState = {
  type: 'onError', // onError, onClose, onCommunicate, onScan
  data: {}
}

const PostNativeView = () => {
  const partner = useSelector((state) => state?.sk?.partner)
  useEffect(() => {
    const toast = postNativeInfo.subscribe((props) => {
      const value = { ...initialState, ...props }

      try {
        if (toUpper(partner?.type ?? '') === 'ANDROID') postANDROID(value)
        else if (toUpper(partner?.type ?? '') === 'IOS') postIOS(value)
        else if (toUpper(partner?.type ?? '') === 'EXPO') postRNWebview(value)
        else postWeb(value)
      } catch (error) {
        // messageInfo.next({ message: error?.message ?? 'Error postMessage', isVisible: true })
      }
    })

    return () => {
      toast.unsubscribe()
    }
  }, [partner])

  function postANDROID(val) {
    try {
      switch (val.type) {
        case 'onClose': // onClose
          return window.messageHandlers.onClose()
        case 'onCommunicate': // onCommunicate
          return window.messageHandlers.onCommunicate(JSON.stringify(val))
        case 'onDeposit':
          return window.messageHandlers.onDeposit(JSON.stringify(val))
        case 'onWithDraw':
          return window.messageHandlers.onWithdraw(JSON.stringify(val))
        case 'onTransfer':
          return window.messageHandlers.onTransfer(JSON.stringify(val))
        case 'onScan': // onScan
          return window.messageHandlers.onScanQr()
        case 'onKyc':
          return window.messageHandlers.onKyc(val?.data?.kycVideo, val?.data?.kycIdentifyImg, val?.data?.kycFace)
        case 'onTakePicture':
          return window.messageHandlers.onTakeImageDocument()
        case 'onUpdateIdentify':
          return window.messageHandlers.onUpdateIdentify()
        case 'getContacts':
          return window.messageHandlers.getContacts()
        case 'onOpenSetting':
          return window.messageHandlers.onOpenSetting()
        case 'showButtonCloseNapas':
          return window.messageHandlers.showButtonCloseNapas(!!val.isShowButtonClose)
        default: // onError
          return window.messageHandlers.onError(JSON.stringify(val))
      }
    } catch (error) {
      console.log('postNativeInfo android', error)
    }
  }

  function postIOS(val) {
    try {
      switch (val.type) {
        case 'onClose': // onClose
          return window.webkit.messageHandlers.onClose.postMessage('success')
        case 'onCommunicate': // onCommunicate
          return window.webkit.messageHandlers.onCommunicate.postMessage(val)
        case 'onDeposit':
          return window.webkit.messageHandlers.onDeposit.postMessage(val)
        case 'onWithDraw':
          return window.webkit.messageHandlers.onWithdraw.postMessage(val)
        case 'onTransfer':
          return window.webkit.messageHandlers.onTransfer.postMessage(val)
        case 'onUpdateIdentify':
          return window.webkit.messageHandlers.onUpdateIdentify.postMessage(val)
        case 'getContacts':
          return window.webkit.messageHandlers.getContacts.postMessage(val)
        case 'onOpenSetting':
          return window.webkit.messageHandlers.onOpenSetting.postMessage(val)
        case 'onScan': // onScan
          return window.webkit.messageHandlers.onPay.postMessage('success')
        case 'showButtonCloseNapas': // onScan
          return window.webkit.messageHandlers.showButtonCloseNapas.postMessage({ isShowButtonClose: !!val.isShowButtonClose })
        case 'onKyc':
        {
          // Map lại data theo key server cho iOS
          const kycParam = {
            kycVideo: val?.data?.kycVideo ?? false, identifyImg: val?.data?.kycIdentifyImg ?? false, faceImg: val?.data?.kycFace ?? false
          }
          return window.webkit.messageHandlers.openCamera.postMessage(kycParam)
        }
        default: // onError
          return window.webkit.messageHandlers.onError.postMessage(val)
      }
    } catch (error) {
      console.log('postNativeInfo ios', error)
    }
  }

  function postWeb(val) {
    // switch (val.type) {
    //   case 'onClose': // onClose
    //     return window.parent.postMessage({ type: 'turnoff' }, '*')
    //   case 'GET_WALLET_INFO': // onClose
    //     return window.parent.postMessage({ type: 'GET_WALLET_INFO', data: val.data }, '*')
    //   default: // onError, onCommunicate
    //     return window.parent.postMessage(val, '*')
    // }
    return window.parent.postMessage(val, '*')
  }

  function postRNWebview(val) {
    if (val.type === 'onKyc') {
      const kycParam = {
        kycVideo: val?.data?.kycVideo ?? false, identifyImg: val?.data?.kycIdentifyImg ?? false, faceImg: val?.data?.kycFace ?? false, isUpdateCCCD: val?.data?.isUpdateCCCD ?? false
      }
      const newVal = { ...val, kycMode: kycParam }
      return window.ReactNativeWebView.postMessage(JSON.stringify(newVal))
    }
    return window.ReactNativeWebView.postMessage(JSON.stringify(val))
  }

  return null
}

export { PostNativeView, postNativeInfo }
