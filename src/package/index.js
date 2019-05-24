import NfButton from './button'
import titleLine from './titleLine'
export const componentInstall = function(Vue) {
    Vue.component(NfButton.name, NfButton);
    Vue.component(titleLine.name, titleLine);
}