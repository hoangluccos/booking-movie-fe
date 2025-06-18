import { useEffect, useRef, useState } from "react";
import "./QrStyles.css";
import QrScanner from "qr-scanner";
import instance from "../../../api/instance";
const QrReader = () => {
  // QR States
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [isShowCamera, setIsShowCamera] = useState(true);
  const [ticketInfo, setTicketInfo] = useState(null);
  // Result
  const [scannedResult, setScannedResult] = useState("");

  // Success
  const onScanSuccess = (result) => {
    // 🖨 Print the "result" to browser console.
    console.log(result);
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);
  useEffect(() => {
    const fetch = async () => {
      if (!scannedResult) return;

      try {
        // ✅ Parse JSON string
        const parsed = JSON.parse(scannedResult);
        // ✅ Dừng camera
        await scanner.current?.stop();
        setIsShowCamera(false);

        // ✅ Fetch dữ liệu
        const res = await instance.get(`/book/ticket/${parsed.ticketId}`);
        if (res) {
          console.log("✅ Dữ liệu ticketId:", res.data);
          setTicketInfo(res.data.result);
        }
      } catch (error) {
        console.log("❌ Lỗi khi gọi API:", error);
      }
    };

    fetch();
  }, [scannedResult]);
  const handleRescan = () => {
    window.location.reload();
  };
  return (
    <div className="qr-reader">
      {/* Chỉ hiển thị camera nếu được bật */}
      {isShowCamera && <video ref={videoEl} />}

      {/* Hiển thị kết quả */}
      {ticketInfo && (
        <div className="mt-6 w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          <h3 className="text-xl font-bold mb-3">📄 Thông tin vé</h3>
          <ul className="space-y-2">
            {ticketInfo.map((item, index) => (
              <li key={item.id} className="bg-gray-700 p-3 rounded">
                <p>
                  <strong>Trạng thái : </strong>{" "}
                  <strong className="font-bold px-3 py-1 bg-green-500 rounded-md my-1">
                    Hợp lệ
                  </strong>
                </p>
                <p>
                  <strong>STT:</strong> {index + 1}
                </p>
                <p>
                  <strong>Ticket ID:</strong> {item.ticketId}
                </p>
                <p>
                  <strong>Ghế:</strong> {item.seat.locateRow}
                  {item.seat.locateColumn}
                </p>
                <p>
                  <strong>Giá:</strong> {item.price.toLocaleString()} VND
                </p>
                <p>
                  <strong>Loại ghế:</strong>{" "}
                  {item.seat.isCouple ? "Ghế đôi" : "Ghế đơn"}
                </p>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleRescan}
          >
            🔄 Quét lại
          </button>
        </div>
      )}
    </div>
  );
};

export default QrReader;
