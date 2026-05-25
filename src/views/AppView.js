import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import '../assets/styles/App.css';
import Button from '../components/Button';
import { Parser } from 'expr-eval';

class AppView extends React.Component {

state = {
    fullText: '0',
    resultText: '',
    isResultClicked : false,
    isResultInvalid: false
}

undoClick = () => {
    this.functionalButtonClick('C');
}

/**
 * digitClick
 * @param { integer } digit
 * @return { void } Click to digit and adds to full text
 */
digitClick = (digit) => {
    
    if(this.state.isResultClicked){
        this.setState({ fullText : digit.toString(), resultText : '', isResultClicked: false});
    }else{
        let { fullText } = this.state;

        // If fullText is 0, then clear it
        if(fullText === "0."){
            // fullText = "";
        }else if(parseFloat(fullText) === 0){
            fullText = "";
        }
    
        fullText = fullText + digit.toString();
        this.setState({ fullText });
    }
}

operationClick = (operationSign) =>{
    let { fullText, resultText } = this.state;
    console.log('resultText', resultText)
    if(resultText.length > 0){
        this.setState({ 
            fullText : resultText+operationSign, 
            isResultClicked: false 
        });
        this.setState({ 
            resultText : '',
        });
    }else{
        fullText = fullText + operationSign;
        this.setState({ fullText });
    }
}

/**
 * dotClick
 * @return { void } Handle Dot click
 */
dotClick = () => {
    if(this.state.isResultClicked){
        this.setState({ fullText : "0.", resultText : '', isResultClicked: false});
    }else{
        let { fullText } = this.state;
        fullText = fullText + ".";
        this.setState({ fullText });
    }
}


/**
 * functionalButtonClick
 * @return { void } Handle multiple events
 */
functionalButtonClick = (key) => {
    let { fullText, resultText } = this.state;

    switch (key) {
        case "AC":
            this.setState({ fullText : "0", resultText : "" });
            break;

        case "C":
            this.setState({ resultText : "" });
            // Delete one by one character from fullText

            if(fullText.length > 0 ){
                let newFullText = fullText.slice(0, -1);
                if(newFullText === ""){
                    newFullText = "0";
                }
                this.setState({ fullText : newFullText });
            }
            
            break;

        case "CUT_FIRST":
            this.setState({ resultText : "" });

            // Delete one by one character from fullText
            if(fullText.length > 0 ){
                let newFullText = fullText.substring(1);
                if(newFullText === ""){
                    newFullText = "0";
                }
                this.setState({ fullText : newFullText });
            }
            
            break;
        
        case "MC":
            // Clear Memory
            localStorage.setItem('CALC_M', "0");
            break;

        case "MR":
            // MR = Memory Recall uses the number in memory, acts as if you had keyed in that number yourself
            let memValue = localStorage.getItem('CALC_M') || "0";
            let newFullText = memValue;
            this.setState({ fullText : newFullText, resultText: '' });
            break;


        case "M+":
            // Memory Add takes the number on the display, adds it to the memory, and puts the result into memory
            let getMemoryValue = parseFloat(localStorage.getItem('CALC_M') || "0");
            let totalResult = parseFloat(resultText.length > 0 ? resultText : "0") + getMemoryValue;
            localStorage.setItem('CALC_M', totalResult.toString());
            break;

        case "M-":
            // Memory Minus takes the number on the display, minus it to the memory, and puts the result into memory
            let memValue2 = parseFloat(localStorage.getItem('CALC_M') || "0");
            let totalResult2 = parseFloat(resultText.length > 0 ? resultText : "0") - memValue2;
            localStorage.setItem('CALC_M', totalResult2.toString());
            break;

        case "1/x":
            // Get Values in FullText and 1/parse(FullText)
            try {
                let fullTextNew = "(1/("+fullText+"))";
                let finalResult = this.parseCalculate(fullTextNew);
                this.setState({ fullText: fullTextNew, resultText : finalResult.toString() });
            } catch (error) {
                this.setState({ fullText: "", resultText : "" });
            }
            break;

        case "x^2":
            try {
                let fullTextNew = "("+fullText+")^2";
                let finalResult = this.parseCalculate(fullTextNew);
                this.setState({ fullText: fullTextNew, resultText : finalResult.toString() });
            } catch (error) {
                this.setState({ fullText: "", resultText : "" });
            }
            break;

        case "+-":
            try {
                let fullTextNew = "-("+fullText+")";
                // let finalResult = this.parseCalculate(fullTextNew);
                this.setState({ fullText: fullTextNew, resultText : "" });
            } catch (error) {
                this.setState({ fullText: "", resultText : "" });
            }
            break;

        case "SQ_ROOT":
            try {
                let finalResult = this.parseCalculate(fullText);
                finalResult = Math.sqrt(finalResult);
                let fullTextNew = "√("+fullText+")";
                this.setState({ fullText: fullTextNew, resultText : finalResult.toString(), isResultInvalid : false });
            } catch (error) {
                this.setState({ fullText: "", resultText : "invalid", isResultInvalid : true });
            }
            break;
    
        default:
            break;
    }
}

/**
 * equalClick
 * @return { void } Handle Equal click
 */
equalClick = () => {
    try {
        let finalResult = this.parseCalculate(this.state.fullText);
        this.setState({ resultText: finalResult.toString(), isResultClicked : true, isResultInvalid : false });
    } catch (error) {
        console.log('error', error)
        let resultText = "invalid";
        this.setState({ resultText, isResultClicked : true, isResultInvalid : true });
    }
    
}


/**
 * parseCalculate
 * @param { string } the full text for calculation
 * @return { float } Final parsed result 
 */
parseCalculate = (fullText) => {
    let finalResult = 0;
    finalResult = Parser.evaluate(fullText);
    return finalResult;
}

/**
 * checkKeyboardEvent
 * @return { function } Check and make action if any keyboard is pressed
 */
checkKeyboardEvent = (event) => {
    if(event.key === "0" || event.key === "1" || event.key === "2" || event.key === "3" || event.key === "4" || event.key === "5" || event.key === "6" || event.key === "7" || event.key === "8" || event.key === "9") {
        this.digitClick(parseInt(event.key));
    }else if(event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
        return this.operationClick(event.key)
    }else if(event.key === "="){
        this.equalClick();
    }else if(event.key === "Backspace"){
        this.functionalButtonClick("C");
    }else if(event.key === "Enter"){
        this.equalClick();
    }
}

// Handle Key board event
componentDidMount(){
    document.addEventListener("keydown", this.checkKeyboardEvent, false);
    localStorage.setItem('CALC_M', localStorage.getItem('CALC_M') || "0");
}

// Remove Handle Key board event
componentWillUnmount(){
    document.removeEventListener("keydown", this.checkKeyboardEvent, false);
}


/**
 * printResultTextCSS
 * @return { string } css of result span
 */
getExpressionSizeClass = () => {
    const { fullText, resultText } = this.state;
    const totalLength = fullText.length + resultText.length;
    if (totalLength <= 18) return 'calc-expression--md';
    if (totalLength <= 35) return 'calc-expression--sm';
    if (totalLength <= 55) return 'calc-expression--xsm';
    return 'calc-expression--xxsm';
}

  render() { 
    const { fullText, resultText, isResultInvalid } = this.state;
    return ( 
        <div className="App">
            <main className="calc-app">
                <header className="calc-app__header">
                    <h1><span className="calc-app__brand">MI</span> Calculator</h1>
                    <p className="calc-app__tagline">Scientific · Memory · Keyboard</p>
                </header>

                <section className="calc-panel">
                    <div className="calc-display">
                        <div className={`calc-expression ${this.getExpressionSizeClass()}`}>
                            {fullText}
                        </div>
                        {resultText.length > 0 && (
                            <div className={`calc-result ${isResultInvalid ? 'calc-result--error' : 'calc-result--success'}`}>
                                = {resultText}
                            </div>
                        )}
                    </div>

                    <div className="calc-keypad">
                        <div className="calc-row calc-row--4">
                            <Button isIcon="fa fa-undo" buttonClass="calc-btn--utility" onClick={this.undoClick} ariaLabel="Undo" />
                            <Button isIcon="fa fa-arrow-left" buttonClass="calc-btn--utility" onClick={() => this.functionalButtonClick('CUT_FIRST')} ariaLabel="Delete first character" />
                            <Button buttonClass="calc-btn--utility" onClick={() => this.functionalButtonClick('C')} textValue="C" />
                            <Button buttonClass="calc-btn--utility" onClick={() => this.functionalButtonClick('AC')} textValue="AC" />
                        </div>

                        <div className="calc-row calc-row--4">
                            <Button buttonClass="calc-btn--memory" onClick={() => this.functionalButtonClick('MC')} textValue="mc" />
                            <Button buttonClass="calc-btn--memory" onClick={() => this.functionalButtonClick('M+')} textValue="m+" />
                            <Button buttonClass="calc-btn--memory" onClick={() => this.functionalButtonClick('M-')} textValue="m-" />
                            <Button buttonClass="calc-btn--memory" onClick={() => this.functionalButtonClick('MR')} textValue="mr" />
                        </div>

                        <div className="calc-row">
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(7)} textValue="7" />
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(8)} textValue="8" />
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(9)} textValue="9" />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.operationClick('/')} textValue="÷" />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.functionalButtonClick('SQ_ROOT')} textValue="√" />
                        </div>

                        <div className="calc-row">
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(4)} textValue="4" />
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(5)} textValue="5" />
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(6)} textValue="6" />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.operationClick('*')} textValue="×" />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.functionalButtonClick('x^2')} textValue="x²" />
                        </div>

                        <div className="calc-row">
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(1)} textValue="1" />
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(2)} textValue="2" />
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(3)} textValue="3" />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.operationClick('-')} textValue="−" />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.functionalButtonClick('1/x')} textValue="¹⁄ₓ" />
                        </div>

                        <div className="calc-row">
                            <Button buttonClass="calc-btn--digit" onClick={() => this.digitClick(0)} textValue="0" />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.dotClick()} textValue="." />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.functionalButtonClick('+-')} textValue="±" />
                            <Button buttonClass="calc-btn--operator" onClick={() => this.operationClick('+')} textValue="+" />
                            <Button buttonClass="calc-btn--equal" onClick={() => this.equalClick()} textValue="=" />
                        </div>
                    </div>
                </section>

                <footer className="calc-app__footer">
                    &copy; 2026, <a href="https://github.com/Mithunan600" target="_blank" rel="noreferrer">Mithun A N</a>
                </footer>
            </main>
        </div>
     );
  }
}
 
export default AppView;
