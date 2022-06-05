function logout(){
    localStorage.clear();
    window.location.href = '/';
}
function getLoggedInData(){
    if( JSON.parse(localStorage.getItem('user'))){
        
        let data=JSON.parse(localStorage.getItem('user'));
        return data;

    }
}