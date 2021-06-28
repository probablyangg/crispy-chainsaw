const { expect } = require("chai");

describe("chubbyUprising is able to receive & mint a chubby", async function () {
	let dummyChubby,
		chubbyUprising,
		CID,
		u = [],
		alice;

	this.beforeEach(async function () {
		CID = "QmUXLHcjFEtquVX2ikdWuiPXhWa4DYrRbymhoAhf1icp9A";
		u = await ethers.getSigners();
		alice = u[0];

		let DummyChubby = await ethers.getContractFactory("DummyChubby");
		DummyChubby.connect(alice);
		dummyChubby = await DummyChubby.deploy();
		await dummyChubby.deployed();

		let ChubbyUprising = await ethers.getContractFactory("ChubbyUprising");
		chubbyUprising = await ChubbyUprising.deploy(CID, dummyChubby.address);
		await chubbyUprising.deployed();
	});

	it("chubbyUprising should have the correct case sensitive cid", async function () {
		expect(await chubbyUprising.CID()).to.eql(CID);
	});
	it("chubbyUprising should have the correct case sensitive dummy chubby address", async function () {
		expect(await chubbyUprising.ChubbiesContract()).to.eql(dummyChubby.address);
	});
	it("dummy chubby should mint a new item successfully", async function () {
		// check token deployed = 0
		expect(await dummyChubby.tokenIds()).to.equal(0);

		// mint a new token
		const mintNewItemTx = await dummyChubby.mintItem(await alice.getAddress());
		await mintNewItemTx.wait();

		// check token deployed = 1
		expect(await dummyChubby.tokenIds()).to.equal(1);
	});
	it("chubbyUprising should be able to receive a chubby", async function () {
		const mintNewItemTx = await dummyChubby.mintItem(await alice.getAddress());
		await mintNewItemTx.wait();

		// check owner of token Id 1 = alice
		expect(await dummyChubby.ownerOf(1)).to.equal(await alice.getAddress());

		// check value of counter on uprisen chubby = 0
		expect(await chubbyUprising.chubbiesReceived()).to.equal(0);

		// alice sends her chubby to chubby uprising contract
		const sendItemTx = await dummyChubby[
			"safeTransferFrom(address,address,uint256,bytes)"
		](await alice.getAddress(), chubbyUprising.address, 1, dummyChubby.address);
		await sendItemTx.wait();

		// check owner of token id 1
		expect(await dummyChubby.ownerOf(1)).to.equal(chubbyUprising.address);

		// check value of counter on uprisen chubby
		expect(await chubbyUprising.chubbiesReceived()).to.equal(1);
	});
	it("chubbyUprising should only receive an nft from dummy chubby", async function () {
		// deploy a new random nft (clone of dummy chubby)

		let NotChubby = await ethers.getContractFactory("DummyChubby");
		notChubby = await NotChubby.deploy();
		await notChubby.deployed();

		const mintChubbyTx = await dummyChubby.mintItem(await alice.getAddress());
		await mintChubbyTx.wait();

		const mintNotChubbyTx = await notChubby.mintItem(await alice.getAddress());
		await mintNotChubbyTx.wait();

		// alice sends her chubby to chubby uprising contract
		const sendChubbyTx = await dummyChubby[
			"safeTransferFrom(address,address,uint256,bytes)"
		](await alice.getAddress(), chubbyUprising.address, 1, "0x");
		await sendChubbyTx.wait();

		// alice sends her "not" chubby to chubby uprising contract
		const sendNotChubbyTx = await notChubby[
			"safeTransferFrom(address,address,uint256,bytes)"
		](await alice.getAddress(), chubbyUprising.address, 1, "0x");
		await sendNotChubbyTx.wait();

		expect(await dummyChubby.ownerOf(1)).to.equal(chubbyUprising.address);
		expect(await notChubby.ownerOf(1)).to.equal(chubbyUprising.address);

		// check value of counter on uprisen chubby
		expect(await chubbyUprising.chubbiesReceived()).to.equal(1);
	});
	it("chubbyUprising should mint the token id corresponding to the received chubby", async function () {
		const mintChubbyTx = await dummyChubby.mintItem(await alice.getAddress());
		await mintChubbyTx.wait();

		const sendChubbyTx = await dummyChubby[
			"safeTransferFrom(address,address,uint256,bytes)"
		](await alice.getAddress(), chubbyUprising.address, 1, "0x");
		await sendChubbyTx.wait();

		expect(await dummyChubby.ownerOf(1)).to.equal(chubbyUprising.address);
		expect(await chubbyUprising.ownerOf(1)).to.equal(await alice.getAddress());
	});
	it("chubbyUprising should return the correct token uri", async function () {
		const mintChubbyTx = await dummyChubby.mintItem(await alice.getAddress());
		await mintChubbyTx.wait();

		const sendChubbyTx = await dummyChubby[
			"safeTransferFrom(address,address,uint256,bytes)"
		](await alice.getAddress(), chubbyUprising.address, 1, "0x");
		await sendChubbyTx.wait();

		const cid = await chubbyUprising.CID();
		expect(await chubbyUprising.tokenURI(1)).to.equal(
			"https://dweb.link/ipfs/" + cid + "/1",
		);
	});
});
