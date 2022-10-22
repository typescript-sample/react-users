// @ts-ignore
import PropTypes from 'prop-types';
import '../assets/css/text-editor.scss';
// import { BaseComponent, HistoryProps } from '../../core';
import configEditor from './config-editor.json';
import './text-editor.scss';
import { OnClick, useUpdate } from 'react-hook-core';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'; 

interface PropsStyle {
  value: string | boolean;
  text: string;
}

interface InternalProp {
  html: string;
}
export type CountdownHandle = {
  start: () => void;
};
export const TextEditorComponent: React.FC<{
  html: string,
  ref: any
}> = forwardRef(({ html }, ref) => {

  useImperativeHandle(
    ref,
    () => ({
      getData() {
        return oDoc.current.innerHTML
      }
    })
  )

  const [text, setRext] = useState<string>('');
  const [sDefTxt, setSDefTxt] = useState<string>('');
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [selectionCreateRange, setSelectionCreateRange] = useState<boolean>(false);
  const [savedSelection, setSavedSelection] = useState<any>();
  const [updateInit, setUpdateInit] = useState<boolean>(false);
  const [parentNodesCurrent, setParentNodesCurrent] = useState<string[]>([]);

  const [textSelectionChange, setTextSelectionChange] = useState<string>('');
  const currentNodeHTML = useRef<any>();
  const oDoc = useRef<any>();
  const switchMode = useRef<any>();

  useEffect(() => {
    if (updateInit) {
      oDoc.current.innerHTML = html;
      setUpdateInit(true)
    }
    initDoc()
  }, [])

  const initDoc = () => {
    // sDefTxt = oDoc.current.innerHTML;
    if (switchMode.current.checked) {
      setDocMode();
    }
    document.body.spellcheck = false;
    oDoc.current.addEventListener('click', idNode);
    // oDoc.current.addEventListener('click', (e: OnClick) => {
    //   selectionChange(e);
    // });
    // hidden toolbar when init
    const toolBar = document.getElementById('toolBar');
    if (toolBar)
      toolBar.style.display = 'none';
  }

  const onBlurChange = () => {
    // props.editorChange(oDoc.current.innerHTML);
  }

  const getCurrentTagName = () => {
    const tag = currentNodeHTML.current.hasOwnProperty('tagName') && currentNodeHTML.current.tagName === 'LI' ? currentNodeHTML.current.parentNode.tagName : currentNodeHTML.current.tagName;
    return tag;
  }

  const getStyleValue = (styleName: any) => {
    if (!currentNodeHTML.current) {
      return '';
    } else {
      return bruceforceStyleValue(styleName, currentNodeHTML.current);
    }
  }

  const hasStyle = (att: any, value: any) => {
    const classes = 'active';
    if (!currentNodeHTML.current) {
      return '';
    } else {
      getListTagCurrent();
      return bruceforceStyleValue(att, currentNodeHTML.current) === value && classes;
    }
  }

  const hasTagName = (tagName: string) => {
    if (!tagName) {
      return;
    }
    if (!currentNodeHTML.current) {
      return '';
    } else {
      getCurrentTagName();
      return bruceforceTagName(tagName, currentNodeHTML.current);
    }
  }

  const hasTagNameFormatText = (tagName: string) => {
    if (!tagName) {
      return;
    }
    const classes = 'active';
    if (!currentNodeHTML.current) {
      return '';
    } else {
      return bruceforceTagName(tagName, currentNodeHTML.current) ? currentNodeHTML.current.firstChild : '';
    }
  }

  const getAttributeValue = (attName: string) => {
    if (!currentNodeHTML.current) {
      return '';
    } else {
      return bruceforceAttribute(attName, currentNodeHTML.current);
    }
  }
  const bruceforceAttribute = (attr: string, currentNode: any): any => {
    const currentValue = currentNode.getAttribute(attr);
    if (currentNode.tagName && currentNode.tagName === 'DIV' || !currentValue) {
      return false;
    } else if (currentValue) {
      return currentValue;
    } else {
      if (!currentNode.parentNode) {
        return false;
      }
      return bruceforceAttribute(attr, currentNode.parentNode);
    }
  }

  const bruceforceStyleValue = (attr: string, currentNode: any): any => {
    const currentValue = currentNode.style[attr];
    if (currentNode.tagName && currentNode.tagName === 'DIV' || !currentValue) {
      return false;
    } else if (currentValue) {
      return currentValue;
    } else {
      if (!currentNode.parentNode) {
        return false;
      }
      return bruceforceStyleValue(attr, currentNode.parentNode);
    }
  }

  const bruceforceTagName = (tagName: string, currentNode: any): any => {
    if (currentNode && currentNode.tagName === 'DIV') {
      return false;
    } else if (currentNode && currentNode.tagName === tagName) {
      return true;
    } else {
      if (!currentNode.parentNode) {
        return false;
      }
      return bruceforceTagName(tagName, currentNode.parentNode);
    }
  }

  const idNode = (e: PointerEvent) => {
    e.preventDefault();
    selectionChange(e);
    // oDoc.current.focus();
    if (currentNodeHTML.current)
      currentNodeHTML.current = e.target
    getListTagCurrent();
    if (textSelectionChange) {
      const toolBar = document.getElementById('toolBar');
      if (toolBar && toolBar.style) {
        toolBar.style.left = '0';
        toolBar.style.top = '0';
        toolBar.style.display = 'block';
      }
    }
    return e;
  }


  const saveSelectionForCreateRanage = (containerEl: any) => {
    const range = window.getSelection()?.getRangeAt(0);
    if (!range) return
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(containerEl);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    return {
      start,
      end: start + range.toString().length
    };
  }

  const restoreSelectionForCreateRange = (containerEl: any, savedSel: any) => {
    let charIndex = 0;
    const range = document.createRange();
    range.setStart(containerEl, 0);
    range.collapse(true);
    const nodeStack = [containerEl];
    let node = null, foundStart = false, stop = false;
    while (!stop) {
      node = nodeStack.pop();
      if (node === undefined) {
        break;
      }
      if (node.nodeType === 3) {
        const nextCharIndex = charIndex + node.length;
        if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
          range.setStart(node, savedSel.start - charIndex);
          foundStart = true;
        }
        if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
          range.setEnd(node, savedSel.end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    const sel = window.getSelection();
    if (!sel) return
    sel.removeAllRanges();
    sel.addRange(range);
  }

  const saveSelectionForCreateTextRange = (containerEl: any) => {
    // @ts-ignore
    const selectedTextRange = document.selection.createRange();
    // @ts-ignore
    const preSelectionTextRange = document.body.createTextRange();
    preSelectionTextRange.moveToElementText(containerEl);
    preSelectionTextRange.setEndPoint('EndToStart', selectedTextRange);
    const start = preSelectionTextRange.text.length;

    return {
      start,
      end: start + selectedTextRange.text.length
    };
  }

  const restoreSelectionForCreateTextRange = (containerEl: any, savedSel: any) => {
    // @ts-ignore
    const textRange = document.body.createTextRange();
    textRange.moveToElementText(containerEl);
    textRange.collapse(true);
    textRange.moveEnd('character', savedSel.end);
    textRange.moveStart('character', savedSel.start);
    textRange.select();
  }


  const selectionChange = (e: MouseEvent) => {
    if (window.getSelection() && document.createRange()) {
      const savedSelection = saveSelectionForCreateRanage(document.getElementById('content-editor'));
      setSelectionCreateRange(true)
      setSavedSelection(savedSelection)
    } else {
      // @ts-ignore
      if (document.selection && document.body.createTextRange) {
        const savedSelection = saveSelectionForCreateTextRange(document.getElementById('content-editor'));
        setSelectionCreateRange(false)
        setSavedSelection(savedSelection)
      }
    }
    let textSelection: string = '';
    if (window.getSelection()) {
      // @ts-ignore
      textSelection = window.getSelection();
    } else if (document.getSelection) {
      // @ts-ignore
      textSelection = document.getSelection();
    } else {
      // @ts-ignore
      if (document.selection) {
        // @ts-ignore
        textSelection = document.selection.createRange().text;
      }
    }
    setTextSelectionChange(textSelection.toString())
    if (textSelection.toString().length > 0) {
      const toolBar = document.getElementById('toolBar');
      const selection = window.getSelection();
      // If the selection doesn't represent a range, let's ignore it.
      // --
      // NOTE: I'd rather use the "type" property (None, Range, Caret); however, in
      // my testing, this does not appear to be supported in IE. As such, we'll use
      // the rangeCount and test the range dimensions).
      if (!selection || !selection.rangeCount) {
        return;
      }
      // Technically, a selection can have multiple ranges, as defined in the
      // "Selection.rangeCount" property; but, for the most part, we are only going
      // to deal with the first (and often only) selection range.
      const topDefault = 30;
      const rangeToolBar = selection.getRangeAt(0);
      const editorForm = document.getElementById('editor-form');
      if (!editorForm) return
      const editorFormTop = editorForm.getBoundingClientRect().top + 20;
      const editorFormLeft = editorForm.getBoundingClientRect().left;
      const topToolBar = rangeToolBar.getBoundingClientRect().top - editorFormTop - topDefault;
      let leftToolBar = rangeToolBar.getBoundingClientRect().left - editorFormLeft;
      // check toolbar left in editor
      const contentEditor = document.getElementById('content-editor');
      if (toolBar && toolBar.style) {
        toolBar.style.display = 'inline-block';
        toolBar.style.position = 'absolute';
        if (contentEditor && toolBar) {
          const widthOfContentEditor = contentEditor.offsetWidth;
          const widthOfToolBar = toolBar.offsetWidth;
          if (widthOfContentEditor - widthOfToolBar <= leftToolBar) {
            leftToolBar = widthOfContentEditor - widthOfToolBar;
          }
        }
        toolBar.style.top = topToolBar.toString() + 'px';
        toolBar.style.left = leftToolBar.toString() + 'px';
      }
    } else {
      const toolBar = document.getElementById('toolBar');
      if (toolBar && toolBar.style) {
        toolBar.style.left = '0';
        toolBar.style.top = '0';
        toolBar.style.display = 'none';
      }
    }
    return e;
  }


  const removeAllClassActive = () => {
    document
      .querySelectorAll('.active')
      .forEach(el => {
        el.classList.remove('active');
      });
  }

  const removeOrAddClassActive = (id: string) => {
    const elementClass = document.getElementById(id);
    if (elementClass && elementClass.classList) {
      if (elementClass.classList.contains('active')) {
        elementClass.classList.remove('active');
      } else {
        elementClass.classList.add('active');
      }
    }
  }

  const checkAlign = (currentNodeHTML: any) => {
    if (currentNodeHTML.current && currentNodeHTML.current.style && currentNodeHTML.current.style !== '') {
      if (currentNodeHTML.current.style['text-align'] === 'center') {
        removeOrAddClassActive('align-center');
      }
      if (currentNodeHTML.current.style['text-align'] === 'left') {
        removeOrAddClassActive('align-left');
      }
      if (currentNodeHTML.current.style['text-align'] === 'right') {
        removeOrAddClassActive('align-right');
      }
    }
  }

  const getListTagCurrent = () => {
    removeAllClassActive();
    // clearSelected();
    const result: string[] = [];
    if (!(currentNodeHTML.current && currentNodeHTML.current.firstChild)) {
      return;
    }
    let node = currentNodeHTML.current.firstChild;
    let nodeParent = currentNodeHTML.current;
    // find root element
    while (nodeParent) {
      if (nodeParent === null || nodeParent.parentNode === null || nodeParent.parentNode.className === 'body-content-editor') {
        break;
      }
      if (nodeParent.parentNode.nodeName === 'DIV') {
        nodeParent = nodeParent.parentNode;
        break;
      }
      nodeParent = nodeParent.parentNode;
    }
    node = nodeParent;
    checkAlign(node);
    while (node) {
      if (node !== this && node.nodeType === Node.ELEMENT_NODE) {
        result.push(node);
      }
      checkAlign(node.firstChild);
      node = node.firstChild;
    }
    setParentNodesCurrent(result);
    findAndActiveSelected();
  }

  const clearSelected = () => {
    // @ts-ignore
    document.getElementById('format_text').value = false;
    // @ts-ignore
    document.getElementById('format_font').value = false;
    // @ts-ignore
    document.getElementById('format_size').value = false;
    // @ts-ignore
    document.getElementById('format_background_color').value = false;
    // @ts-ignore
    document.getElementById('format_color').value = false;
  }

  const findAndActiveSelected = () => {
    let {
      FormatTexts,
      FormatFonts,
      FormatSizes,
      FormatBackgroundColors,
      FormatColors
    } = configEditor.config;
    let newFormatTexts = FormatTexts.map((item: PropsStyle) => item.value);
    let newFormatFonts = FormatFonts.map((item: PropsStyle) => item.value);
    let newFormatSizes = FormatSizes.map((item: PropsStyle) => item.value);
    let newFormatBackgroundColors = FormatBackgroundColors.map((item: PropsStyle) => item.value);
    let newFormatColors = FormatColors.map((item: PropsStyle) => item.value);
    // @ts-ignore
    for (const _node: Node of parentNodesCurrent) {
      // @ts-ignore
      const nodeName = _node.nodeName;
      const formatText = newFormatTexts.filter((str: string | boolean) => str === nodeName.toLowerCase());
      const formatFont = newFormatFonts.filter((str: string | boolean) => str === nodeName.toLowerCase());
      // @ts-ignore
      const formatSize = newFormatSizes.filter((str: string | boolean) => str === _node.getAttribute('size'));
      // @ts-ignore
      const formatBackgroundColor = newFormatBackgroundColors.filter((str: string | boolean) => str === _node.style['background-color']);
      // @ts-ignore
      const formatColors = newFormatColors.filter((str: string | boolean) => str === _node.getAttribute('color'));
      if (formatText.length > 0) {
        // @ts-ignore
        document.getElementById('format_text').value = formatText[0];
      }
      if (formatFont.length > 0 && document.getElementById('format_font')) {
        // @ts-ignore
        document.getElementById('format_font').value = formatFont[0];
      }
      if (formatSize.length > 0 && document.getElementById('format_size')) {
        // @ts-ignore
        document.getElementById('format_size').value = formatSize[0];
      }
      // @ts-ignore
      if (formatBackgroundColor.length > 0 && document.getElementById('format_background_color')) {
        // @ts-ignore
        document.getElementById('format_background_color').value = formatBackgroundColor[0];
      }
      if (formatColors.length > 0 && document.getElementById('format_color')) {
        // @ts-ignore
        document.getElementById('format_color').value = formatColors[0];
      }
      if (nodeName === 'B') {
        removeOrAddClassActive('bold');
      }
      if (nodeName === 'I') {
        removeOrAddClassActive('italic');
      }
      if (nodeName === 'U') {
        removeOrAddClassActive('underline');
      }
      if (nodeName === 'UL') {
        removeOrAddClassActive('list-ul');
      }
      if (nodeName === 'OL') {
        removeOrAddClassActive('list-ol');
      }
      if (nodeName === 'BLOCKQUOTE') {
        removeOrAddClassActive('list-ol');
      }
      if (nodeName === 'A') {
        removeOrAddClassActive('slink');
      }
    }
  }

  const convertToHTML = (item: any) => {
    return `<p className="${item.value}">${item.text}</p>`;
  }

  const formatDoc = (e: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent<HTMLElement, MouseEvent>, sCmd?: string, sValue?: string) => {
    e.preventDefault();
    if (validateMode()) {
      getListTagCurrent();
      document.execCommand(sCmd || '', false, sValue);
      oDoc.current.focus();
    }
  }

  const validateMode = () => {
    if (!switchMode.current.checked) {
      return true;
    }
    alert('Uncheck "Show HTML".');
    oDoc.current.focus();
    return false;
  }

  const addHyperLinkToolBar = (e: OnClick) => {
    e.preventDefault();
    const sLnk1 = null;
    const sLnk = document.getElementById('sLnk');
    if (sLnk != null) {
      // @ts-ignore
      setShowToolbar(!showToolbar)
      if (!showToolbar) { // is close toolbar
        addHyperLink(e, (sLnk as any)['value'], 'createLink');
      }
    }
  }

  const toggleHyperLinkToolBar = (e: OnClick) => {
    e.preventDefault();
    const sLnk = document.getElementById('sLnk');
    const buttonSlink = document.getElementById('slink');
    if (buttonSlink != null) {
      if (buttonSlink.classList && buttonSlink.classList.contains('active')) {
        addHyperLink(e, 'unlink', 'unlink');
      } else {
        // @ts-ignore

        setShowToolbar(!showToolbar)
        if (!showToolbar) { // is close toolbar
          if (sLnk && (sLnk as any)['value']) {
            addHyperLink(e, (sLnk as any)['value'], 'createLink');
          }
        }
      }
    }
  }

  // const getXPath = (node: any): string => {
  //   if (node.hasAttribute('id')) {
  //     return '//' + node.tagName + '[@id="' + node.id + '"]';
  //   }

  //   if (node.hasAttribute('class')) {
  //     return '//' + node.tagName + '[@class="' + node.getAttribute('class') + '"]';
  //   }

  //   const old = '/' + node.tagName;
  //   const new_path = getXPath(node.parentNode) + old;

  //   return new_path;
  // }

  const addHyperLink = (e: OnClick, sLnk: string, commandId: string) => {
    if (sLnk && sLnk.length > 0) {// && (sLnk.includes('http://') || sLnk.includes('https://'))
      if (selectionCreateRange) {
        restoreSelectionForCreateRange(document.getElementById('content-editor'), savedSelection);
      } else {
        restoreSelectionForCreateTextRange(document.getElementById('content-editor'), savedSelection);
      }
      oDoc.current.focus();
      if (commandId === 'unlink') {
        // @ts-ignore
        document.execCommand(commandId, false, false);
      } else {
        document.execCommand(commandId, false, sLnk);
      }
    }
  }

  const setDocMode = () => {
    const bToSource = switchMode.current.checked;
    let oContent;
    if (bToSource) {
      oContent = document.createTextNode(oDoc.current.innerHTML);
      oDoc.current.innerHTML = '';
      const oPre = document.createElement('div');
      oDoc.current.contentEditable = false;
      oPre.id = 'sourceText';
      oPre.contentEditable = 'true';
      oPre.style.height = '100%';
      oPre.appendChild(oContent);
      oDoc.current.appendChild(oPre);
      document.execCommand('defaultParagraphSeparator', false, 'div');
    } else {
      if (document.all) {
        oDoc.current.innerHTML = oDoc.current.innerText;
      } else {
        // remove pre tag when content is empty
        oContent = document.createRange();
        oContent.selectNodeContents(oDoc.current.firstChild);
        oDoc.current.innerHTML = oContent.toString();
      }
      oDoc.current.contentEditable = true;
    }
    oDoc.current.focus();
  }

  const printDoc = () => {
    if (!validateMode()) {
      return;
    }
    const oPrntWin = window.open('',
      '_blank', 'width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes'
    );
    if (!oPrntWin) return
    oPrntWin.document.open();
    oPrntWin.document.write(
      '<!doctype html><html><head><title>Print</title></head><body onload="print();">' +
      oDoc.current.innerHTML + '</body></html>');
    oPrntWin.document.close();
  }


  const {
    FormatTexts,
    FormatFonts,
    // Formats,
    FormatSizes,
    FormatBackgroundColors,
    FormatColors
  } = configEditor.config;
  // toolBar-text toolBar btn-group toolBar-button
  // @ts-ignore
  // @ts-ignore
  return (
    <div>
      <div id='editor-form' className='editor-form'>
        <div className='body-content-editor'>
          <div id='toolBar' className={''}>
            {!showToolbar ? <div className={'toolBar btn-group toolBar-button'}>
              <div className={'input-group'}>
                <select name='format_text' id='format_text' onChange={($event) => {
                  formatDoc($event, 'formatblock', $event.target.value);
                  hasTagNameFormatText('H1');
                }} className='custom-select'>
                  {FormatTexts && FormatTexts.map((item: PropsStyle, index: number) => (
                    <option key={index} value={item.value.toString()}>{item.text}</option>)
                  )}
                </select>
                <select name='format_font' id='format_font' onChange={($event) => {
                  formatDoc($event, 'fontname', $event.target.value);
                  getAttributeValue('face');
                }} placeholder='select font' className='custom-select'>
                  {FormatFonts && FormatFonts.map((item: PropsStyle, index: number) => (
                    <option key={index} value={item.value.toString()}>{item.text}</option>)
                  )}
                </select>
                <select name='format_size' id='format_size' onChange={($event) => {
                  formatDoc($event, 'fontsize', $event.target.value);
                  getAttributeValue('size');
                }} className='custom-select'>
                  {FormatSizes && FormatSizes.map((item: PropsStyle, index: number) => (
                    <option key={index} value={item.value.toString()}>{item.text}</option>)
                  )}
                </select>
                <select name='format_color' id='format_color' onChange={($event) => {
                  formatDoc($event, 'forecolor', $event.target.value);
                  getAttributeValue('color');
                }} className='custom-select'>
                  {FormatColors && FormatColors.map((item: PropsStyle, index: number) => (
                    <option key={index} value={item.value.toString()}>{item.text}</option>)
                  )}
                </select>
                <div className='input md-3'>
                  <select name='format_background_color' id='format_background_color' onChange={($event) => {
                    formatDoc($event, 'backcolor', $event.target.value);
                    getStyleValue(' background-color');
                  }} className='custom-select'>
                    {FormatBackgroundColors && FormatBackgroundColors.map((item: PropsStyle, index: number) => (
                      <option key={index} value={item.value.toString()}>{item.text}</option>)
                    )}
                  </select>
                </div>
              </div>
              <button className='btn' type='button' onClick={printDoc}>
                <i className='material-icons'>print </i>
              </button>
              < button className='btn ' type='button' onClick={(e) => {
                formatDoc(e, 'undo');
              }}>
                <i className='material-icons'>undo </i>
              </button>
              <button className='btn ' type='button' onClick={(e) => {
                formatDoc(e, 'redo');
              }}>
                <i className='material-icons'>redo </i>
              </button>
              <button className='btn ' type='button' onClick={(e) => {
                formatDoc(e, 'removeFormat');
              }}>
                <i className='material-icons'>format_clear </i>
              </button>
              <button id='bold' type='button' onClick={(e) => {
                formatDoc(e, 'bold');
              }} className={'btn ' + hasTagName('B')}>
                <i className='material-icons'>format_bold </i>
              </button>
              <button id='italic' type='button' onClick={(e) => {
                formatDoc(e, 'italic');
              }} className={'btn ' + hasTagName('I')}>
                <i className='material-icons'>format_italic </i>
              </button>
              <button id='underline' type='button' onClick={(e) => {
                formatDoc(e, 'underline');
              }} className={'btn ' + hasTagName('U')}>
                <i className='material-icons'>format_underlined </i>
              </button>
              <button id='align-left' type='button' onClick={(e) => {
                formatDoc(e, 'justifyleft');
              }} className={'btn ' + hasStyle('text-align', 'left')}>
                <i className='material-icons'>format_align_left </i>
              </button>
              <button id='align-center' type='button' onClick={(e) => {
                formatDoc(e, 'justifycenter');
              }} className={'btn ' + hasStyle('text-align', 'center')}>
                <i className='material-icons'>format_align_center </i>
              </button>
              <button id='align-right' type='button' onClick={(e) => {
                formatDoc(e, 'justifyright');
              }} className={'btn ' + hasStyle('text-align', 'right')}>
                <i className='material-icons'>format_align_right </i>
              </button>
              <button type='button' onClick={(e) => {
                formatDoc(e, 'insertorderedlist');
              }} className={'btn ' + hasTagName('OL')}>
                <i className='material-icons'>format_list_numbered </i>
              </button>
              <button id='list-ul' type='button' onClick={(e) => {
                formatDoc(e, 'insertunorderedlist');
              }} className={'btn ' + hasTagName('UL')}>
                <i className='material-icons'>format_list_bulleted </i>
              </button>
              <button id='quote-left' type='button' onClick={(e) => {
                formatDoc(e, 'formatblock', 'blockquote');
              }} className={'btn ' + hasTagName('BLOCKQUOTE')}>
                <i className='material-icons'>format_quote </i>
              </button>
              <button id='outdent' className='btn ' type='button' onClick={(e) => {
                formatDoc(e, 'outdent');
              }}>
                <i className='material-icons'>format_indent_decrease </i>
              </button>
              <button id='indent' className='btn ' type='button' onClick={(e) => {
                formatDoc(e, 'indent');
              }}>
                <i className='material-icons'>format_indent_increase </i>
              </button>
              <button type='button' id='slink' onClick={toggleHyperLinkToolBar}
                className={'btn ' + hasTagName('a')}>
                {/*<i className='fa fa-link'/>*/}
                <i className='material-icons'>insert_link</i>
              </button>
            </div>
              : <div className={'input-link '}>
                <label className='col s12 m6'>
                  <input type='text' id='sLnk' name='sLnk'
                    placeholder='Past or type link here....' />
                  <i className={'fa fa-times close'} onClick={addHyperLinkToolBar} />
                </label>
              </div>
            }
            <span className='highlightMenu-arrowClip' />
          </div>
          <div id='content-editor' className='textBox text-editor-body' contentEditable={true}
            onInput={e => {
              onBlurChange();
            }}
            onBlur={onBlurChange}
            ref={oDoc}
            dangerouslySetInnerHTML={{ __html: html }}
            placeholder='Enter some text'
          />
        </div>
        <p className='editMode editor_bottom'>
          <label><input type='checkbox' name='switchMode' id='switchBox' onChange={setDocMode}
            ref={switchMode} />
            <i className='fa fa-code' />HTML</label>
        </p>
      </div>
    </div>
  );

})

// @ts-ignore
