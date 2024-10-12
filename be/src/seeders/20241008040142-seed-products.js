'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Products', [
      {
        name: "Màn hình android Ownice C970 pro",
        path: "man-hinh-android-ownice-c970-pro",
        detail:
          `
## Cấu hình đầu Android C970-S:
### Tóm tắt

- CPU: 8 nhân (6+2) tối đa hiệu suất và tiết kiệm điện

- RAM/ROM: 4GB+64GB

- Display: 2.5D + IPS 1280×720 pixel 9″ hoặc 10.1″

- Connect: WiFi, 4G LTE, Bluetooth 5.0, USB, HDMI, Optical

### Sức mạnh nổi bật
Cấu hình đủ mạnh với CPU 8 nhân, RAM 3GB, bộ nhớ trong 32GB,
Bộ vi xử lý Allwiner T7 ARM Cortex 8 nhân UIS7862 (UMS512) công nghệ 12nm có tốc độ xử lý siêu khủng. Với 2 Cortex A75 + 6 Cortex A55 cho phép hoạt động hiệu suất cao và tiết kiệm năng lượng. 6 Cortex A55 được ưu tiên hoạt động, chúng mang lại một sức mạnh lớn khi giải quyết nhiều tính toán nhưng tối ưu về mặt tiêu thụ năng lượng. Khi có nhiều tính toán phức tạp hơn, 2 Cotex A75 được sử dụng để đẩy hiệu suất công việc tăng vọt.

Đầu C970-S hoạt động mượt mà với RAM 3GB, đáp ứng được nhiều ứng dụng nặng hoạt động đồng thời.
### Lưu trữ được nhiều với 32GB bộ nhớ

Nếu ít lưu trữ nhạc và video chất lượng cao thì dung lượng nhớ 32GB là khá thoải mái để sử dụng. Một số ứng dụng chat sẽ lưu trữ ảnh và video trong tin nhắn theo thời gian có thể làm tiêu tốn bộ nhớ. Để hoạt động tốt, chỉ cần lưu ý dọn dẹp rác định kỳ.
### Màn hình cao cấp độ phân giải cao IPS 1280×720
Từ lâu, Ownice đã nổi tiếng với chất lượng màn hình cảm ứng đa điểm số 1 thị trường. Tới phiên bản C970, màn hình tiếp tục được nâng cấp lên độ phân giải full HD 1280×720 pixel. Cùng đó, màn hình có viền uốn 2.5D tạo độ mượt khi chạm tay, hỗ trợ IPS cho khả năng chống lóa tốt khi trời nắng.
### Tích hợp bộ xử lý âm thanh DSP
Nổi tiếng với bộ xử lý DSP của hãng ROHM Semiconduction (Nhật bản) cho đầu ra âm thanh tốt ở những phiên bản trước. Ownice C970 đã tích hợp bộ xử lý âm thanh với khả năng điều chỉnh 48 dải âm. Có thể chỉnh vị trí người nghe trên giao diện để đạt trải nghiệm âm thanh tốt nhất.

Màn hình Ownice còn được sử dụng chip âm ly công suất TDA 7851L (7388 for 3+32G) tốt nhất hiện nay.
### Hỗ trợ kết nối Wifi + 4G LTE
Không chỉ Wifi, màn hình Ownice C970 có tích hợp kết nối SIM 4G LTE. Điều này rất thuận tiện nếu như bạn muốn sử dụng SIM DATA riêng cho xe. Việc sử dụng gói SIM 4G DATA chuyên dụng của nhà mạng vừa tiết kiệm, dung lượng băng thông lớn, lại chủ động và thuận tiện hơn việc phát wifi từ điện thoại cho xe. Bạn thậm chí có thể tiết kiệm việc đăng ký 4G SIM điện thoại, và sử dụng luôn tính năng phát WiFi trên đầu android C970.
### Tích hợp Bluetooth 5.0
Nhiều người ít quan tâm tới các phiên bản Bluetooth, tuy nhiên ở phiên bản Bluetooth 5.0 có nhiều điểm đáng để chúng ta kinh ngạc.

- Khoảng cách truyền xa gấp 4 lần thế hệ Bluetooth 4.0, đạt tới 300m như Wifi

- Tốc độ truyền dữ liệu tăng gấp đôi, đạt tới 2Mbps, cho khả năng truyền âm thanh chất lượng đỉnh cao.

- Dung lượng truyền dữ liệu (băng thông) tăng gấp 8 lần.

- Tiết kiệm điện năng tới 2,5 lần với chuẩn LE, hầu như không tiêu hao điện khi ở chế độ nghỉ

- Kết nối được nhiều thiết bị cùng lúc, điều mà các phiên bản trước chỉ giới hạn kết nối 1-1.

- Tương thích ngược với các thiết bị sử dụng chuẩn Bluetooth thấp hơn.

### Tích hợp đầu vào Camera lùi
Không còn lạ lẫm, đây là tính năng rất cần thiết của một màn hình Android. Khi cài số lùi, camera lùi tự động kích hoạt màn hình để hỗ trợ lùi. Nếu xe được trang bị thêm cảm biến va chạm, sẽ trở thành combo trợ thủ đắc lực.
### Kết nối màn hình gối qua HDMI out
Từ bản tiêu chuẩn của C970 còn có thêm ngõ ra HDMI Out. Tính năng này đặc biệt hữu ích khi hàng ghế phía sau có màn hình riêng. Việc xem phim, nghe nhạc có thể phục vụ đồng thời cho khách hàng ghế sau. Kết nối màn hình ngoài cũng có thể sử dụng cáp USB AV out.
### Tích hợp cổng ra quang học Optical
Thay vì sử dụng cổng âm thanh Audio-out thông thường, cổng Optical cho phép truyền lượng dữ liệu lớn hơn. Đặc biệt, do là tín hiệu cáp quang nên không bị nhiễu xạ bởi sóng điện từ, mang lại chất lượng âm thanh hoàn hảo.

Khi kết hợp với tính năng DSP và bộ vi xử lý âm thanh tốt của Ownice C970, cùng một dàn loa chất lượng, chúng ta dễ dàng có được một phòng âm tuyệt vời ngay trên xe.
### Phần mềm điều chỉnh âm thanh đặc biệt
Màn hình C970 sở hữu phần mềm điều chỉnh âm thanh cao cấp của hãng thiết kế, hỗ trợ tới 9 ngôn ngữ, chắc chắn sẽ đem lại trải nghiệm thú vị. Để kích hoạt ứng dụng này cần có bản quyền của hãng.
### Thiết kế mỏng nên lắp được cho hầu hết các loại xe
Màn hình Ownice có thiết kế mỏng, dễ lắp cho hầu hết các dòng xe hiện có trên thị trường. Điều này cũng được chứng minh trong những phiên bản trước đây như C500, C600, C800, C900, C960.

### Hỗ trợ cổng USB sạc nhanh
Sạc nhanh là tính năng đáng giá đối với xe hơi, khi mà thời gian di chuyển thông thường không liên tục. Bạn sẽ bỏ lỡ một cú sạc đầy 100% pin điện thoại và phải sạc nhiều lần nếu sử dụng cổng sạc thông thường. Điều đó gây hại nghiêm trọng tới tuổi thọ của pin và thiết bị di động.
        
        `,
        quantity: 10,
        price: 500000,
        currency: "VND",
        categoryId: 1,
        imageUrl: "https://autohungdung.com/wp-content/uploads/2023/01/33502699.jpg",
        createdAt: new Date(),
        updatedAt: new Date()

      },], {});
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
