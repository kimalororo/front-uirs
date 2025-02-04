<template>
    <div class="header"> 
        <div class="header_el">
        <h1 style="margin-left: 20px;">Logo</h1>
        <my-input style="margin-left: 20%; margin-top: 0; width: 40%; height: 70px; border-radius: 10px;"/> 
        <div class="profile" style="margin-left: 20%;">
            <div class="pict">
                picture
            </div>
            <h2 style="margin-left: 20px;">Account info</h2>
            <div class="pict" style="margin-left: 20px; background-color:crimson;"> LogOut</div>
        </div>
        </div>
    </div>
</template>

<script>
export default{

}
</script>

<style scoped>
.header {
    height: 160px;
    width: 100%;
    background-color: teal;
    box-shadow: 2px 2px 4px gray;
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0 15px;
    margin-left: a;
}
.header_el {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    width: 100%;
}
.profile {
    display: flex;
    background-color: white;
    width: 21%;
    height: 90px;
    border-radius: 10px;
    align-items: center;
    justify-content: flex-start;
}
.pict{
    height: 50px; 
    width: 50px; 
    border-radius: 50%; 
    border-color: black;
    border: 1px; 
    background-color: teal;
    margin-left: 10px;
    align-items: center;
    justify-content: center;
    display: flex;
}
</style>