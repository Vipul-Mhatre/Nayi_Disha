// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonation {
    struct Charity {
        string name;
        string description;
        address payable charityAddress;
        uint256 totalDonations;
        bool registered;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        bool refunded;
    }

    mapping(uint256 => Charity) public charities;
    mapping(uint256 => Donation[]) public donations;
    uint256 public charityCount;

    event CharityRegistered(
        uint256 charityId,
        string name,
        address charityAddress
    );
    event DonationReceived(uint256 charityId, address donor, uint256 amount);
    event FundsReleased(uint256 charityId, uint256 amount);
    event ReportSubmitted(uint256 charityId, string report);
    event RefundIssued(uint256 charityId, address donor, uint256 amount);

    function registerCharity(
        string memory _name,
        string memory _description,
        address payable _charityAddress
    ) public {
        charityCount++;
        charities[charityCount] = Charity(
            _name,
            _description,
            _charityAddress,
            0,
            true
        );
        emit CharityRegistered(charityCount, _name, _charityAddress);
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function donate(uint256 _charityId) public payable {
        require(charities[_charityId].registered, "Charity not registered.");
        charities[_charityId].totalDonations += msg.value;
        donations[_charityId].push(Donation(msg.sender, msg.value, block.timestamp, false));
        emit DonationReceived(_charityId, msg.sender, msg.value);
    }


    function getCharity(uint256 _charityId)
        public
        view
        returns (
            string memory name,
            string memory description,
            address charityAddress,
            uint256 totalDonations,
            bool registered
        )
    {
        require(charities[_charityId].registered, "Charity not registered.");
        Charity memory charity = charities[_charityId];
        return (
            charity.name,
            charity.description,
            charity.charityAddress,
            charity.totalDonations,
            charity.registered
        );
    }

    function getDonations(uint256 _charityId)
    public
    view
    returns (
        address[] memory donors,
        uint256[] memory amounts,
        uint256[] memory timestamps,
        bool[] memory refunded
    )
{
    require(charities[_charityId].registered, "Charity not registered.");
    uint256 donationCount = donations[_charityId].length;

    donors = new address[](donationCount);
    amounts = new uint256[](donationCount);
    timestamps = new uint256[](donationCount);
    refunded = new bool[](donationCount);

    for (uint256 i = 0; i < donationCount; i++) {
        Donation memory donation = donations[_charityId][i];
        donors[i] = donation.donor;
        amounts[i] = donation.amount;
        timestamps[i] = donation.timestamp;
        refunded[i] = donation.refunded;
    }

    return (donors, amounts, timestamps, refunded);
}


    function getAllCharities()
        public
        view
        returns (uint256[] memory, Charity[] memory)
    {
        uint256[] memory charityIds = new uint256[](charityCount);
        Charity[] memory allCharities = new Charity[](charityCount);
        for (uint256 i = 1; i <= charityCount; i++) {
            charityIds[i - 1] = i;
            allCharities[i - 1] = charities[i];
        }
        return (charityIds, allCharities);
    }

    function getCharities(uint256 _start, uint256 _end)
        public
        view
        returns (
            string[] memory names,
            string[] memory descriptions,
            address[] memory charityAddresses,
            uint256[] memory totalDonations,
            bool[] memory registered
        )
    {
        require(_end >= _start, "Invalid range.");
        uint256 length = _end - _start + 1;
        require(length <= charityCount, "Exceeds number of charities.");

        names = new string[](length);
        descriptions = new string[](length);
        charityAddresses = new address[](length);
        totalDonations = new uint256[](length);
        registered = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            Charity memory charity = charities[_start + i];
            names[i] = charity.name;
            descriptions[i] = charity.description;
            charityAddresses[i] = charity.charityAddress;
            totalDonations[i] = charity.totalDonations;
            registered[i] = charity.registered;
        }

        return (
            names,
            descriptions,
            charityAddresses,
            totalDonations,
            registered
        );
    }

    function releaseFunds(uint256 _charityId, uint256 _amount) public {
        require(charities[_charityId].registered, "Charity not registered.");
        require(
            _amount <= address(this).balance,
            "Insufficient balance in contract."
        );
        charities[_charityId].charityAddress.transfer(_amount);
        emit FundsReleased(_charityId, _amount);
    }

    function submitReport(uint256 _charityId, string memory _report) public {
        require(charities[_charityId].registered, "Charity not registered.");
        require(
            msg.sender == charities[_charityId].charityAddress,
            "Only the charity can submit reports."
        );
        emit ReportSubmitted(_charityId, _report);
    }

    function requestRefund(uint256 _charityId) public {
        require(charities[_charityId].registered, "Charity not registered.");
        for (uint256 i = 0; i < donations[_charityId].length; i++) {
            if (
                donations[_charityId][i].donor == msg.sender &&
                !donations[_charityId][i].refunded
            ) {
                uint256 refundAmount = donations[_charityId][i].amount;
                donations[_charityId][i].refunded = true;
                payable(msg.sender).transfer(refundAmount);
                emit RefundIssued(_charityId, msg.sender, refundAmount);
                break;
            }
        }
    }
}
