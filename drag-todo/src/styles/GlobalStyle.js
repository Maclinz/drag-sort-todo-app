import {createGlobalStyle} from  'styled-components'

export const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700;800&display=swap');
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body{
        font-family: 'Nunito Sans', sans-serif;
    }

    body::-webkit-scrollbar{
        width: 0px;
    }
`;