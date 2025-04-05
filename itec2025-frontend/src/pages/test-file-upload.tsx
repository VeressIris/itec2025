export default function TestFileUpload() {
  return (
    <div>
      <form>
        <input type="file" name="file" accept=".pdf" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
