async function replyline(ev,rikeibunkeiflug) {
    const pro =  await client.getProfile(ev.source.userId); //awaitがあるので、この処理を待ってから次の行にいく。
    return client.replyMessage(ev.replyToken, {
      type: "text",
      text: `${pro.displayName}さん、今「${ev.message.text}」って言いました？`
    })
   }