const Payment = artifacts.require("./Payment.sol");

const BN = web3.utils.BN;


contract("Payment", accounts => {

    const customer = accounts[0]
    const pam = accounts[1]
    const fred = accounts[2]

    it("...should transfer funds to a specified account.", async () => {
    
      const getBalance = async function (addr) {
          let balance = await web3.eth.getBalance(addr);
          let output = new BN(balance)
          return output;
      }
      const paymentInstance = await Payment.deployed();

      const amount = 2
      const fee = 1
      const invoiceId = "A1B2"
      const fredBalanceBefore = await getBalance(fred)
      const pamBalanceBefore = await getBalance(pam)

      const tx = await paymentInstance.makePayment(amount, fred, fee, pam, invoiceId, {from: customer, value: fee + amount})
      
      const fredBalanceAfter = await getBalance(fred)
      const pamBalanceAfter = await getBalance(pam)

      assert.equal(tx.logs[0].event, 'Paid', "Paid event should be emitted")
      assert.equal(fredBalanceAfter.sub(fredBalanceBefore).toString(10), 2, "Fred should have a balance of 2")
      assert.equal(pamBalanceAfter.sub(pamBalanceBefore).toString(10), 1, "Pam should have a balance of 1")
    });
  });